import { getMetadataArgsStorage } from "../Application.ts";

// export function Middleware(route: RegExp): Function {
//   return function (middleware: any) {
//     getMetadataArgsStorage().middlewares.push({
//       type: "middleware",
//       target: new middleware(),
//       object: middleware,
//       route: route,
//     });
//   };
// }

export const Middleware: MethodDecorator = (
  target,
  propertyKey,
  descriptor: TypedPropertyDescriptor<any>,
) => {
  getMetadataArgsStorage().middlewares.push(descriptor.value);
  return descriptor;
};
