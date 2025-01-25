import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { ChatRoomRepository } from "../domain/interfaces/chat-room-repository";
import { ChatRoom } from "../domain/models/chat-room";
import { chatRoomsTable } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

export default function makeChatRoomRepository(
  db: NodePgDatabase<Record<string, never>>
): ChatRoomRepository {
  async function create(chatRoom: ChatRoom) {
    await db.insert(chatRoomsTable).values(chatRoom);
  }

  return { create };
}
