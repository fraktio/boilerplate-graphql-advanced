import fs from "fs";

const rules = [
  "/* eslint-disable max-len */",
  "/* eslint-disable @typescript-eslint/no-explicit-any */",
  "/* eslint-disable @typescript-eslint/ban-types */",
  "/* eslint-disable max-lines */",
  "/* eslint-disable no-restricted-imports */",
];

const data = fs.readFileSync("./app/generation/generated.ts"); // read existing contents into data
const fd = fs.openSync("./app/generation/generated.ts", "w+");
const buffer = Buffer.from([...rules, "\n"].join("\n"));

fs.writeSync(fd, buffer, 0, buffer.length, 0); // write new data
fs.writeSync(fd, data, 0, data.length, buffer.length); // append old data
