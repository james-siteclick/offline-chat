import { User } from "./domain/models/user";

export type Config = {
  secretKey: string;
  users: User[];
};

export const config: Config = {
  secretKey: "something-very-secret-here",
  users: [
    {
      id: "578c2027-a44a-43ec-b09c-633625b30161",
      username: "jack",
      password: "tea",
    },
    {
      id: "3348f3bf-7287-4eb4-8643-3a89006feb10",
      username: "jill",
      password: "coffee",
    },
  ],
};
