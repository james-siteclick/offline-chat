import { User } from "@offline-chat/backend";
import { z } from "zod";
import { mapResponseToError } from "./utils/http-error";

const baseUrl = `${window.location.origin}/api`;

export const UserWithToken = z.object({
  user: User,
  token: z.string(),
});
export type UserWithToken = z.infer<typeof UserWithToken>;

export async function authenticate(username: string, password: string) {
  const response = await fetch(`${baseUrl}/authenticate`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    throw mapResponseToError(response);
  }
  const data = await response.json();
  return UserWithToken.parse(data);
}
