import { Reflect } from "../deps.ts";
import {
  REQUEST_BODY_METADATA,
  REQUEST_BODY_TRANSFORM_METADATA,
} from "../metadata.ts";

export const RequstBody = (transform?: any): Function =>
  (
    target: Object,
    propertyKey: string,
    index: number,
  ) => {
    Reflect.defineMetadata(REQUEST_BODY_METADATA + propertyKey, index, target);
    Reflect.defineMetadata(
      REQUEST_BODY_TRANSFORM_METADATA + propertyKey,
      transform,
      target,
    );
  };
