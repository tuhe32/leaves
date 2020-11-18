import { MetadataArgsStorage, ROUTE_MIDDLEWARE } from "./metadata.ts";
export { Application as App } from "./Application.ts";
import { Reflect } from "./deps.ts";
export type { Req, Res } from "./model.ts";

export type ObjectKeyAny = { [key: string]: any };

const global: ObjectKeyAny = {};

export function getMetadataArgsStorage(): MetadataArgsStorage {
  if (!(global as any).routingControllersMetadataArgsStorage) {
    (global as any).routingControllersMetadataArgsStorage =
      new MetadataArgsStorage();
  }

  return (global as any).routingControllersMetadataArgsStorage;
}

export * as validator from "https://esm.sh/class-validator@0.12.2";
export * as transformer from "https://esm.sh/class-transformer@0.3.1";

// DI
export * from "./injection/index.ts";
// Decorator
export * from "./decorator/mod.ts";

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
