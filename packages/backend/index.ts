// Import the framework and instantiate it
import { drizzle } from "drizzle-orm/node-postgres";
import Fastify from "fastify";

import { makeValidator, ValidationError } from "./utils/validator";

import { PutChatRoomBody } from "./dto/put-chat-room";

import { ConflictError } from "./domain/interfaces/error";
import makeCreateChatRoom from "./domain/use-cases/create-chat-room";
import makeGetChatRoom from "./domain/use-cases/get-chat-rooms";
import makeChatRoomRepository from "./repository/chat-room-repository";

// @todo put database connection string in config
const db = drizzle("postgres://chat:password@127.0.0.1:5432/chat");

// Repositories
const chatRoomRepository = makeChatRoomRepository(db);

// Use cases
const getChatRoom = makeGetChatRoom();
const createChatRoom = makeCreateChatRoom(chatRoomRepository);

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/chat-rooms", async function handler(request, reply) {
  return getChatRoom();
});

fastify.put("/chat-rooms", async function handler(request, reply) {
  const data = makeValidator(PutChatRoomBody)(request.body);
  const result = await createChatRoom(data);
  return reply.status(200).send(result);
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
