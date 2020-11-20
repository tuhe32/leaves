import { Controller } from "../../../decorator/Controller.ts";
import { Get, Post } from "../../../decorator/RequestMapping.ts";
import { RequestParam } from "../../../decorator/RequestParam.ts";
import { RequestBody } from "../../../decorator/RequestBody.ts";
import { Validate } from "../../../decorator/Validate.ts";
import { LogMiddleware } from "../../middleware/Log.ts";
import { Authorize } from "../../middleware/Authorize.ts";
import { Req, Res } from "../../../mod.ts";
import { FooService } from "../../service/foo.service.ts";
import { User } from "../../model/User.ts";

@Controller("/app")
export class Test2Ctrl {
  constructor(private service: FooService) {
  }

  @Authorize
  @LogMiddleware
  @Get("/test2/:id")
  async testHandle(@RequestParam id: number, req: Req, res: Res) {
    console.log("name2", this.service.getName());
    // throw new Error("tt");
    return this.service.getName();
  }

  @Validate
  @Post("/testPost2/:id")
  async postHandle(@RequestBody(User) person: User, req: Req, res: Res) {
    console.log("person", person);
    return { msg: "ok", status: 0 };
  }
}
