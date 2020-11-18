import { Reflect } from "../deps.ts";
import { REQUEST_PARAM_METADATA } from "../metadata.ts";

export const RequestParam = (
  target: Object,
  propertyKey: string,
  index: number,
) => {
  Reflect.defineMetadata(REQUEST_PARAM_METADATA + propertyKey, index, target);
};
