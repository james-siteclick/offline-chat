import { eq, isNull } from "drizzle-orm";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { ChatRoomRepository } from "../domain/interfaces/chat-room-repository";
import { ConflictError } from "../domain/interfaces/error";
import { ChatRoom } from "../domain/models/chat-room";
import { chatRoomsTable } from "./schema";
import { isDuplicateKeyError } from "./utils/error";
import { pruneNull } from "./utils/prune-null";

const db = drizzle(process.env.DATABASE_URL!);

export default function makeChatRoomRepository(
  db: NodePgDatabase<Record<string, never>>
): ChatRoomRepository {
  async function create(chatRoom: ChatRoom) {
    try {
      await db.insert(chatRoomsTable).values(chatRoom);
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        throw new ConflictError();
      }
      throw err;
    }
  }

  async function get(id: ChatRoom["id"]) {
    const [chatRoom] = await db
      .select()
      .from(chatRoomsTable)
      .where(eq(chatRoomsTable.id, id));
    return ChatRoom.parse(pruneNull(chatRoom));
  }

  async function update(
    id: ChatRoom["id"],
    update: Partial<Omit<ChatRoom, "id">>
  ) {
    await db
      .update(chatRoomsTable)
      .set(update)
      .where(eq(chatRoomsTable.id, id));
  }

  async function getAll() {
    const results = await db
      .select()
      .from(chatRoomsTable)
      .where(isNull(chatRoomsTable.deleted_at));

    console.log(results);
    console.log(results.map(pruneNull));
    return ChatRoom.array().parse(results.map(pruneNull));
  }

  return { create, update, get, getAll };
}
