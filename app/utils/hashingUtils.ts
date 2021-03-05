import bcrypt from "bcryptjs";

const saltRounds = 10;

export const hashingUtils = {
  hashPassword(opts: { password: string }) {
    return bcrypt.hash(opts.password, saltRounds);
  },

  validatePassword(opts: { password: string; hash: string }) {
    return bcrypt.compare(opts.password, opts.hash);
  },
};
