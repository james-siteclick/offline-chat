import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const chatRoomsTable = pgTable("chat_rooms", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  created_at: timestamp().notNull(),
  deleted_at: timestamp(),
});
