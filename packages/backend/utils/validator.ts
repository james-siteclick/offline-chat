import { z } from "zod";

export class ValidationError extends Error {}

export function makeValidator<T>(schema: z.ZodType<any, any, T>) {
  return function validator(data: unknown): T {
    const result = schema.safeParse(data);
    if (result.error) {
      throw new ValidationError("Validation error", { cause: result.error });
    }
    return result.data;
  };
}
