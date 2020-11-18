import { defineMiddleware, Req, Res } from "../../mod.ts";

export const LogMiddleware = defineMiddleware(
  async (req: Req, res: Res, next: Function) => {
    console.log("log1");
    await next();
    console.log("log1 end");
  },
);
