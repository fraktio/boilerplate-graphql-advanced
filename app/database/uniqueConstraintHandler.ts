import { UniqueConstraintViolationFailure } from "~/handlers/failures/UniqueConstraintViolationFailure";

const DATABASE_ERROR_UNIQUE_VIOLATION = "23505";

export async function withUniqueConstraintHandler<T>(
  callback: () => Promise<T>,
  formatError: (error: string) => string,
): Promise<T | UniqueConstraintViolationFailure> {
  try {
    return await callback();
  } catch (error) {
    if (error.code === DATABASE_ERROR_UNIQUE_VIOLATION) {
      const regex = /(\w+)/g;
      const match = error.detail.match(regex);
      const [_, field] = match;

      return new UniqueConstraintViolationFailure(
        field || "",
        formatError(error.detail),
      );
    }
    throw error;
  }
}
