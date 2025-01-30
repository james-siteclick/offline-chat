import { z } from "zod";
import { User } from "../domain/models/user";

export const UserResponse = z.object({
  user: User,
  token: z.string(),
});
export type UserResponse = z.infer<typeof UserResponse>;
