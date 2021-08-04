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

  base64ToString(base64: string): string {
    return Buffer.from(base64, "base64").toString("ascii");
  },

  stringToBase64(string: string): string {
    return Buffer.from(string).toString("base64");
  },
};
