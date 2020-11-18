import { Reflect } from "../deps.ts";
import { METHOD_METADATA, PATH_METADATA } from "../metadata.ts";

const createMappingDecorator = (method: string) =>
  (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(PATH_METADATA, path, descriptor.value!);
      Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value!);
    };
  };

export const Get = createMappingDecorator("get");
export const Post = createMappingDecorator("post");
