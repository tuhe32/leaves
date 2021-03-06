import { Req, ReqBody, ReqMethod, TransformConfigMap } from "./model.ts";
import { ServerRequest } from "./deps.ts";
import { parseQsToMap, parseUrlencoded } from "./utils/parse/url.ts";
import { parseFormData } from "./utils/parse/body.ts";
import { getRequestType } from "./utils/contentType/contentType.ts";

export const decoder = new TextDecoder();
export class Request {
  static createRequest(config: any) {
    return {
      query: null,
      params: null,
      body: null,
      request: new ServerRequest(),
      url: "",
      method: "get" as ReqMethod,
      headers: config.request.headers,
      cookies: parseQsToMap(config.request.headers.get("cookie")),
      ...config,
    };
  }

  #hasBody = (headers: Headers): boolean => {
    return (
      headers.get("transfer-encoding") !== null ||
      !!parseInt(headers.get("content-length") ?? "")
    );
  };

  async parseBody(
    request: Req,
    transformConfigMap?: TransformConfigMap | undefined,
    transform?: any,
  ) {
    const req: ServerRequest = request.request;
    const contentType = request.headers.get("content-type") || "text";
    let body: ReqBody = { type: "", value: {} };
    if (this.#hasBody(request.headers)) {
      // field to save body
      let _body = {};
      // field to save type
      let type: string = "";
      const contentTypeFilter = getRequestType(contentType);
      // deal with form-data first
      if (contentTypeFilter.isFormData) {
        _body = await parseFormData(contentType, req);
        type = "formData";
      } else {
        // get net request body text
        const readContent = await Deno.readAll(req.body);
        // get http body text
        const _b = decoder.decode(readContent);
        if (contentTypeFilter.isText) {
          _body = _b;
          type = "text";
        } else if (contentTypeFilter.isJson) {
          _body = JSON.parse(_b);
          type = "json";
        } else if (contentTypeFilter.isUrlencoded) {
          _body = parseUrlencoded(_b) || {};
          type = "form";
        } else {
          _body = {
            content: readContent,
            value: _b,
          };
          type = "raw";
        }
      }
      body["type"] = type;
      body["value"] = _body;
      Object.assign(body, { value: _body }, { type });
    } else {
      body = {
        type: "",
        value: "",
      };
    }
    if (transformConfigMap !== undefined && transform !== undefined) {
      body.value = transformConfigMap.get("body")?.getTransform(
        transform,
        body.value,
      );
    }
    request.body = body;
  }
}
