// Import the framework and instantiate it
import { drizzle } from "drizzle-orm/node-postgres";
import Fastify from "fastify";
import jwt from "jsonwebtoken";

import { makeValidator, ValidationError } from "./utils/validator";

import { config } from "./config";
import { ConflictError } from "./domain/interfaces/error";
import { makeAuthenticate } from "./domain/use-cases/authenticate";
import makeGetChatRooms, {
  GetChatRoomsQuery,
} from "./domain/use-cases/get-chat-rooms";
import makeUpsertChatRoom from "./domain/use-cases/upsert-chat-room";
import { PostAuthenticateBody } from "./dto/post-authenticate";
import { PutChatRoomBody } from "./dto/put-chat-room";
import { UserResponse } from "./dto/user-response";
import makeChatRoomRepository from "./repository/chat-room-repository";

// @todo put database connection string in config
const db = drizzle("postgres://chat:password@127.0.0.1:5432/chat");

// Repositories
const chatRoomRepository = makeChatRoomRepository(db);

// Use cases
const getChatRooms = makeGetChatRooms(chatRoomRepository);
const upsertChatRoom = makeUpsertChatRoom(chatRoomRepository);
const authenticate = makeAuthenticate(config.users);

const fastify = Fastify({
  logger: true,
});

// Get chat rooms
fastify.get("/chat-rooms", async function handler(request, reply) {
  const query = GetChatRoomsQuery.parse(request.query);
  console.log(query);
  return getChatRooms(query);
});

// Mutate chat room
fastify.put("/chat-rooms", async function handler(request, reply) {
  const data = makeValidator(PutChatRoomBody)(request.body);
  const result = await upsertChatRoom(data);
  return reply.status(200).send(result);
});

// Authenticate
fastify.post("/authenticate", async function handler(request, reply) {
  const data = makeValidator(PostAuthenticateBody)(request.body);
  const user = await authenticate(data);
  if (!user) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
  const userResponse = UserResponse.parse({
    user,
    token: jwt.sign(user, config.secretKey),
  });
  return reply.status(200).send(userResponse);
});

fastify.setErrorHandler((err, request, reply) => {
  if (err instanceof ValidationError) {
    console.info("Validation error", err);
    return reply.status(400).send({ message: "Bad Request" });
  }
  if (err instanceof ConflictError) {
    console.info("Conflict error", err);
    return reply.status(409).send({ message: "Conflict" });
  }
  console.error(err);
  return reply.status(500).send({ message: "Internal Server Error" });
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
