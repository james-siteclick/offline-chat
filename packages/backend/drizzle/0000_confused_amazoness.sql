CREATE TABLE "chat_rooms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
