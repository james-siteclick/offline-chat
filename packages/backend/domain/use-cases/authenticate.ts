import { z } from "zod";
import { User } from "../models/user";

export const AuthenticateRequest = User.pick({
  username: true,
  password: true,
});
export type AuthenticateRequest = z.infer<typeof AuthenticateRequest>;

export type Authenticate = (
  request: AuthenticateRequest
) => Promise<User | undefined>;

export function makeAuthenticate(users: User[]): Authenticate {
  return async function (request: AuthenticateRequest) {
    const user = users.find(
      (user) => user.username.toLowerCase() === request.username.toLowerCase()
    );

    if (user && user.password === request.password) {
      return user;
    }
  };
}
