import bcrypt from "bcryptjs";

const saltRounds = 10;

export const hashingUtils = {
  async hashPassword(opts: { password: string }): Promise<string> {
    return await bcrypt.hash(opts.password, saltRounds);
  },

  async validatePassword(opts: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    return await bcrypt.compare(opts.password, opts.hash);
  },
};
