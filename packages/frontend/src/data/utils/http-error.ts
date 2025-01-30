export function mapResponseToError(response: Response) {
  return new HttpError(response.statusText, response.status);
}

export class HttpError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
  }
}
