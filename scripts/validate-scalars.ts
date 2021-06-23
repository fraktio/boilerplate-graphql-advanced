import fs from "fs";

const data = fs.readFileSync("./app/generation/generated.ts", "utf-8");

const [_, fromScalarDef] = data.split("export type Scalars = {");
const [scalarDefs] = fromScalarDef.split("};", 1);

if (scalarDefs.indexOf(": any;") > -1) {
  const errorMessage = `
  Invalid configuration for typescript scalar types

  verify codegen.yml scalar imports and re-run the command again
`;
  console.error(new Error(errorMessage));
  process.exit(1);
}
