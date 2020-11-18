import { Router } from "./router.ts";
// import { Middleware } from "./middleware.ts";
import {
  container as defaultContainer,
  DependencyContainer,
} from "./injection/index.ts";

export class MetadataArgsStorage {
  router: Router = new Router();

  middlewares: Function[] = [];

  /**
   * Container injections
   */
  container: DependencyContainer = defaultContainer;
}

export const METHOD_METADATA = "method";
export const PATH_METADATA = "path";

export const REQUEST_BODY_METADATA = "request_body_";
export const REQUEST_BODY_TRANSFORM_METADATA = "request_body_transform_";

export const REQUEST_PARAM_METADATA = "request_param_";

export const ROUTE_MIDDLEWARE = "route_middleware";
