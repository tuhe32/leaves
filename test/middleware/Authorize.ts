import { defineMiddleware, Req, Res } from "../../mod.ts";

export const Authorize = defineMiddleware(
  async (req: Req, res: Res, next: Function) => {
    console.log("Authorize");
    const param = req.params.id;
    if (param !== "1") {
      res.body = "No Authorize";
      res.status = 400;
      res.send(req, res);
      return;
    }
    await next();
    console.log("Authorize end");
  },
);
