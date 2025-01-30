import { z } from "zod";

export const User = z.object({
  id: z.string().uuid(),
  username: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof User>;
