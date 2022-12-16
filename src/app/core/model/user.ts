import { Jwt } from "./Jwt";

export class User extends Jwt{
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}
