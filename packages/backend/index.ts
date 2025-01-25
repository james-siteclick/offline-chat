// Import the framework and instantiate it
import Fastify from "fastify";

import makeGetChatRoom from "./domain/use-cases/get-chat-rooms";
const getChatRoom = makeGetChatRoom();

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/chat-rooms", async function handler(request, reply) {
  return getChatRoom();
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
