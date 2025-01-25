import { DatabaseError } from "pg-protocol";

export function isDuplicateKeyError(err: unknown): boolean {
  return err instanceof DatabaseError && err.code === "23505";
}
