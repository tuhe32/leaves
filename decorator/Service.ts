import { typeInfo } from "../injection/dependency-container.ts";
import { getParamInfo } from "../injection/reflection-helpers.ts";

export const Service: ClassDecorator = (target: any) => {
  typeInfo.set(target, getParamInfo(target));
  return target;
};
