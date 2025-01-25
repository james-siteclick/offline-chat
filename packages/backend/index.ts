// Import the framework and instantiate it
import Fastify from "fastify";

import { makeValidator, ValidationError } from "./utils/validator";

import { PutChatRoomBody } from "./dto/put-chat-room";

import makeCreateChatRoom from "./domain/use-cases/create-chat-room";
import makeGetChatRoom from "./domain/use-cases/get-chat-rooms";

const getChatRoom = makeGetChatRoom();
const createChatRoom = makeCreateChatRoom();

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
    console.error("Validation error", err);
    return reply.status(400).send({ message: "Bad Request" });
  }
  throw err;
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
