import { Req, Res } from "../../mod.ts";
import { Middleware } from "../../decorator/Middleware.ts";

export class MiddlewareGlobal {
  @Middleware
  async middle1(req: Req, res: Res, next: Function) {
    console.log("middle1");
    await next();
    console.log("middle1 end");
  }
}
