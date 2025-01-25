import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { ChatRoomRepository } from "../domain/interfaces/chat-room-repository";
import { ConflictError } from "../domain/interfaces/error";
import { ChatRoom } from "../domain/models/chat-room";
import { chatRoomsTable } from "./schema";
import { isDuplicateKeyError } from "./utils/error";

const db = drizzle(process.env.DATABASE_URL!);

export default function makeChatRoomRepository(
  db: NodePgDatabase<Record<string, never>>
): ChatRoomRepository {
  async function create(chatRoom: ChatRoom) {
    try {
      const result = await db.insert(chatRoomsTable).values(chatRoom);
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        throw new ConflictError();
      }
      throw err;
    }
  }

  return { create };
}
