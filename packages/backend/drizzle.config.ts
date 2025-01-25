import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./repository/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "postgres://chat:password@127.0.0.1:5432/chat",
  },
});
