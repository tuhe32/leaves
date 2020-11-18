import { Reflect } from "../deps.ts";
import { ObjectKeyAny, Req, Res } from "../mod.ts";
import {
  METHOD_METADATA,
  PATH_METADATA,
  REQUEST_BODY_METADATA,
  REQUEST_BODY_TRANSFORM_METADATA,
  REQUEST_PARAM_METADATA,
  ROUTE_MIDDLEWARE,
} from "../metadata.ts";
import { getMetadataArgsStorage } from "../mod.ts";
import { getParamInfo } from "../injection/reflection-helpers.ts";
import { typeInfo } from "../injection/dependency-container.ts";

export const CONTROLLER_METADATA = "controller_metadata";
export const BASE_ROUTE = "base_route";

export const Controller = (path: string): ClassDecorator =>
  (target: any) => {
    // const params: any[] = Reflect.getMetadata("design:paramtypes", target) ||
    //   [];
    // console.log(params);
    typeInfo.set(target, getParamInfo(target));
    Reflect.defineMetadata(CONTROLLER_METADATA, true, target);
    Reflect.defineMetadata(BASE_ROUTE, path || "", target);
    const container = getMetadataArgsStorage().container;
    const instance: ObjectKeyAny = container.resolve(target as any);
    mapRoute(target, instance);

    return target;
  };

function mapRoute(target: Function, instance: ObjectKeyAny) {
  const base_route = Reflect.getMetadata(BASE_ROUTE, target);
  const prototype = target.prototype;

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype)
    .filter((item) => isFunction(prototype[item]));
  methodsNames.map((methodName) => {
    let fn = prototype[methodName];

    // 取出定义的 metadata
    const method = Reflect.getMetadata(METHOD_METADATA, fn);
    if (!notUndefined(method)) {
      return;
    }
    const route = Reflect.getMetadata(PATH_METADATA, fn);
    const methodParam = Reflect.getMetadata(
      REQUEST_PARAM_METADATA + methodName,
      prototype,
    );
    const methodBody = Reflect.getMetadata(
      REQUEST_BODY_METADATA + methodName,
      prototype,
    );
    const routeMiddleware = Reflect.getMetadata(ROUTE_MIDDLEWARE, fn);
    const transform = Reflect.getMetadata(
      REQUEST_BODY_TRANSFORM_METADATA + methodName,
      prototype,
    );
    getMetadataArgsStorage().router.add(
      method,
      base_route + route,
      async (req: Req, res: Res) => {
        let result: any;
        if (notUndefined(methodParam)) {
          result = await fn.apply(instance, injectParams(fn, req, res));
        } else if (notUndefined(methodBody)) {
          result = await fn.apply(instance, injectBody(fn, req, res));
        } else {
          result = await fn.apply(instance, [req, res]);
        }
        res.body = result;
      },
      notUndefined(routeMiddleware) ? routeMiddleware : [],
      transform,
    );
  });
}

function isFunction(value: any): value is Function {
  return typeof value === "function";
}

function notUndefined(item: any): boolean {
  return item != undefined && item != "undefined";
}

// 获取函数的参数名
function getParameterName(fn: Function) {
  if (typeof fn !== "object" && typeof fn !== "function") return;
  const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const DEFAULT_PARAMS = /=[^,)]+/mg;
  const FAT_ARROWS = /=>.*$/mg;
  let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString();
  code = code
    .replace(COMMENTS, "")
    .replace(FAT_ARROWS, "")
    .replace(DEFAULT_PARAMS, "");
  let result = code.slice(code.indexOf("(") + 1, code.indexOf(")")).match(
    /([^\s,]+)/g,
  );
  return result === null ? [] : result;
}

function injectParams(fn: Function, req: Req, res: Res) {
  const paramNames = getParameterName(fn);
  const injectParams: any = [];
  const parameter = req.params;
  paramNames.map((paramName: string) => {
    if (parameter[paramName]) {
      injectParams.push(parameter[paramName]);
    } else {
      paramName === "req" ? injectParams.push(req) : injectParams.push(res);
    }
  });
  return injectParams;
}

function injectBody(fn: Function, req: Req, res: Res) {
  const paramNames = getParameterName(fn);
  const injectParams: any = [];
  const body = req.body.value;
  paramNames.map((paramName: string) => {
    if (paramName === "req") {
      injectParams.push(req);
    } else if (paramName === "res") {
      injectParams.push(res);
    } else {
      injectParams.push(body);
    }
  });
  return injectParams;
}
