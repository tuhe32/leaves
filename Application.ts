import { colors, serve, serveTLS, Status } from "./deps.ts";
import { MetadataArgsStorage, ROUTE_MIDDLEWARE } from "./metadata.ts";
import { Reflect } from "./deps.ts";
import { autoLoad } from "./utils/auto.load.ts";
// import {cors} from "../cors.ts";
// import {assets} from "../assets.ts";
// import {appConfig} from "../application.ts";
import {
  ListenOptions,
  Req,
  ReqMethod,
  Res,
  RouteValue,
  TransformConfig,
  TransformConfigMap,
} from "./model.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { ObjectKeyAny } from "./mod.ts";

const global: ObjectKeyAny = {};

export function getMetadataArgsStorage(): MetadataArgsStorage {
  if (!(global as any).routingControllersMetadataArgsStorage) {
    (global as any).routingControllersMetadataArgsStorage =
      new MetadataArgsStorage();
  }

  return (global as any).routingControllersMetadataArgsStorage;
}

export const defineMiddleware = (middleware: Function): MethodDecorator => {
  return (target, key, descriptor) => {
    const routeMiddleware = Reflect.getMetadata(
      ROUTE_MIDDLEWARE,
      descriptor.value,
    ) || [];
    routeMiddleware.push(middleware);
    Reflect.defineMetadata(
      ROUTE_MIDDLEWARE,
      routeMiddleware,
      descriptor.value,
    );
  };
};

export class Application {
  request: Request;
  response: Response;
  private globalErrorHandler?: (res: Res, error: Error) => void;
  private transformConfigMap?: TransformConfigMap | undefined = undefined;

  constructor(
    private controllerOrPath: Function[] | string,
    private middwares: Function[],
  ) {
    if (typeof controllerOrPath === "string") autoLoad(controllerOrPath);
    this.request = new Request();
    this.response = new Response();
  }

  #composeMiddle = (
    middleware: Function[],
    request: Req,
    response: Res,
    execFunc: Function | undefined,
  ) => {
    if (!Array.isArray(middleware)) {
      throw new TypeError("Middleware must be an array!");
    }
    return async function () {
      let index = -1;
      return dispatch(0);
      async function dispatch(i: number): Promise<any> {
        if (i <= index) {
          return Promise.reject(new Error("next() called multiple times"));
        }
        index = i;
        let fn: Function | undefined = middleware[i];
        if (i === middleware.length) {
          fn = execFunc;
          response.status = execFunc ? Status.OK : Status.NotFound;
        }
        try {
          return fn && fn(request, response, dispatch.bind(null, index + 1));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    };
  };

  #handleRequest = async (request: Req, response: Res) => {
    let fv: RouteValue | null = getMetadataArgsStorage().router.find(
      request.method,
      request.url,
    );
    let fn: Function | undefined = undefined;
    const _m = getMetadataArgsStorage().middlewares;
    let m: Function[] = [];
    _m.forEach((value: Function) => {
      m.push(value);
    });
    if (fv) {
      const { middleware, handler, params, query, url, transform } = fv;
      request.params = params;
      request.url = url;
      request.query = query;
      fn = handler;
      middleware.forEach((value: Function) => {
        m.push(value);
      });
      await this.request.parseBody(request, this.transformConfigMap, transform);
    }
    response.redirect = response.redirect.bind(globalThis, response);
    response.render = response.render.bind(globalThis, response);
    const f = this.#composeMiddle(m, request, response, fn);
    await f.call(globalThis);
    response.send(request, response);
  };

  #listen = async (config: ListenOptions): Promise<void> => {
    const server = config;
    const isTls = server.secure;
    const protocol = isTls ? "https" : "http";

    const Server = isTls ? serveTLS(server as any) : serve(server);
    console.log(
      colors.white(
        `server is listening ${protocol}://${server.hostname}:${server.port} `,
      ),
    );
    for await (let request of Server) {
      const res: Res = Response.createResponse();
      const req: Req = Request.createRequest({
        url: request.url,
        method: request.method.toLowerCase() as ReqMethod,
        headers: request.headers,
        request,
      });
      try {
        await this.#handleRequest(req, res);
      } catch (e) {
        console.error(e);
        if (this.globalErrorHandler) {
          this.globalErrorHandler(res, e);
        }
        res.send(req, res);
      }
    }
  };

  async listen(config: ListenOptions) {
    // if(typeof config === 'string'){
    //   appConfig.server = parseAddress(config);
    // } else {
    //   appConfig.server = config as ListenOptions;
    // }
    await this.#listen(config);
  }

  /**
   * Create one global error handler
   */
  public error(
    globalErrorHandler: (res: Res, error: Error) => void,
  ): void {
    this.globalErrorHandler = globalErrorHandler;
  }

  public useTransform(transform: TransformConfig): void {
    if (!this.transformConfigMap) {
      this.transformConfigMap = new Map();
    }
    this.transformConfigMap.set(transform.type, transform);
  }
}
