import type Bunyan from "bunyan";

declare global {
  namespace Express {
    interface Request {
      logger: Bunyan;
      user?: {
        uuid: string;
      };
    }
  }
}
