export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);

    Object.defineProperty(this, "name", { value: "NotFoundError" });
  }
}
