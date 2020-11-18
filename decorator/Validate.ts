import { defineMiddleware, Req, Res } from "../mod.ts";
import { validator } from "../mod.ts";
import { User } from "../test/model/User.ts";

const { validate } = validator;

export const Validate = defineMiddleware(
  async (req: Req, res: Res, next: Function) => {
    console.log("validate");

    const body: User = req.body.value;
    const errors = await validate(body, { validationError: { target: false } });
    if (errors.length > 0) {
      res.body = "Validate Error" + errors;
      res.status = 500;
      res.send(req, res);
      return;
    }
    await next();
    console.log("validate end");
  },
);
