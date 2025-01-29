"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.makeValidator = makeValidator;
class ValidationError extends Error {
}
exports.ValidationError = ValidationError;
function makeValidator(schema) {
    return function validator(data) {
        const result = schema.safeParse(data);
        if (result.error) {
            throw new ValidationError("Validation error", { cause: result.error });
        }
        return result.data;
    };
}
