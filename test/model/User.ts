import { validator } from "../../mod.ts";
const { Length, Contains, IsInt, Min, Max, IsEmail, IsFQDN, IsDate } =
  validator;

export class User {
  id?: number;

  @Length(10, 20)
  name?: string;

  @IsInt()
  age?: number;
}
