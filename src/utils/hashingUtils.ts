import bcrypt from "bcryptjs";

export class HashingUtils {
  private saltRounds = 10;

  hashPassword(opts: { password: string }) {
    return bcrypt.hash(opts.password, this.saltRounds);
  }

  validatePassword(opts: { password: string; hash: string }) {
    return bcrypt.compare(opts.password, opts.hash);
  }
}
