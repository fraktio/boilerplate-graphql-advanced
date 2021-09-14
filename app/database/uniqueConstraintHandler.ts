import { NotFoundFailure } from "~/handlers/failures/NotFoundFailure";
import { UniqueConstraintViolationFailure } from "~/handlers/failures/UniqueConstraintViolationFailure";

const DATABASE_ERROR_UNIQUE_VIOLATION = "23505";

type DbException = {
  code: string;
  detail: string;
};

export async function withUniqueConstraintHandler<T>(
  callback: () => Promise<T>,
  formatError: (error: string) => string,
): Promise<T | UniqueConstraintViolationFailure> {
  try {
    return await callback();
  } catch (error) {
    const err = error as unknown as DbException;
    if (err.code === DATABASE_ERROR_UNIQUE_VIOLATION) {
      const regex = /(\w+)/g;
      const match = err.detail.match(regex);
      if (match) {
        const [_, field] = match;

        const test = new UniqueConstraintViolationFailure(
          field || "",
          formatError(err.detail),
        );

        return test;
      }
    }
    throw error;
  }
}
