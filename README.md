leaves - Web framework For Deno with Decorator and middleware

## Demo - test/

Controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Req,
  RequestBody,
  RequestParam,
  Res,
  Validate,
} from "../deps.ts";
import { LogMiddleware } from "../middleware/Log.ts";
import { Authorize } from "../middleware/Authorize.ts";
import { FooService } from "../service/foo.service.ts";
import { User } from "../model/User.ts";

@Controller("/app")
export class TestCtrl {
  constructor(private service: FooService) {
  }

  @Authorize
  @LogMiddleware
  @Get("/test/:id")
  async testHandle(@RequestParam id: number, req: Req, res: Res) {
    console.log("name", this.service.getName());
    return this.service.getName();
  }

  @Validate
  @Post("/testPost/:id")
  async postHandle(@RequestBody(User) person: User, req: Req, res: Res) {
    console.log("person", person);
    return { msg: "ok", status: 0 };
  }
}
```

Server.ts

```typescript
import { TestCtrl } from "./controller/TestCtrl.ts";
import { MiddlewareGlobal } from "./middleware/Middleware.ts";
import { App, Res, transformer } from "./deps.ts";

const { plainToClass } = transformer;

const app = new App([TestCtrl], [MiddlewareGlobal]);
// global error handler
app.error((res: Res, error: Error) => {
  res.body = "This page unprocessed error: " + error.message;
  res.status = 500;
});
// global body transformer
app.useTransform({
  type: "body", // parse body params
  getTransform: (transform: any, body: any) => {
    return plainToClass(transform, body);
  },
});
app.listen(
  { port: 8000, hostname: "127.0.0.1" },
);
```

tsconfig.app.json:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

Run:

```shell
deno run -c tsconfig.json --allow-net --allow-read --unstable server.ts
```

## Note:

### Load Controllers

```typescript
import { TestCtrl } from "./controller/TestCtrl.ts";

// use path to autoload all
const app = new App("./test/controller", [MiddlewareGlobal]);
// or use controller array 
const app = new App([TestCtrl], [MiddlewareGlobal]);
```



#### Custom Middleware

Log.ts

```typescript
import { defineMiddleware, Req, Res } from "../../mod.ts";

export const LogMiddleware = defineMiddleware(
  async (req: Req, res: Res, next: Function) => {
    console.log("log1");
    await next();
    console.log("log1 end");
  },
);
```

Controller.ts

```typescript
@LogMiddleware
@Get("/test/:id")
async testHandle(@RequestParam id: number, req: Req, res: Res) {
  console.log("name", this.service.getName());
  // throw new Error("tt");
  return this.service.getName();
}
```
