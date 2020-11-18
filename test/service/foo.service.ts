import { Service } from "../../decorator/Service.ts";
import { FooDao } from "./foo.dao.ts";

@Service
export class FooService {
  constructor(private fooDao: FooDao) {}

  getName(): string {
    return this.fooDao.getName();
  }
}
