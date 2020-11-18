import { App, Res, transformer } from "../mod.ts";
import { TestCtrl } from "./controller/TestCtrl.ts";
import { MiddlewareGlobal } from "./middleware/Middleware.ts";
// import { autoLoad } from "./utils/auto.load.ts";
// const s = serve({ port: 8000 });

const { plainToClass } = transformer;

const app = new App([TestCtrl], [MiddlewareGlobal]);
app.error((res: Res, error: Error) => {
  res.body = "This page unprocessed error: " + error.message ||
    500;
  res.status = 500;
});
app.useTransform({
  type: "body", // parse body params
  getTransform: (transform: any, body: any) => {
    return plainToClass(transform, body);
  },
});
app.listen(
  { port: 8000, hostname: "127.0.0.1" },
);
