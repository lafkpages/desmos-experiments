import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join as joinPaths } from "node:path";

import Enquirer from "enquirer";
import ObjFileParser from "obj-file-parser";

import { generateEquations } from "$lib";

const homeDir = homedir();
const filePath = joinPaths(homeDir, "Downloads/untitled.obj");

let fileContents: string;
try {
  fileContents = await readFile(filePath, "utf-8");
} catch {
  const filePathPrompt = await Enquirer.prompt<{ filePath: string }>({
    type: "input",
    name: "filePath",
    message: "Enter the path to the OBJ file:",
  });

  fileContents = await readFile(filePathPrompt.filePath, "utf-8");
}

const objFile = new ObjFileParser(fileContents);
const objData = objFile.parse();

if (objData.models.length < 1) {
  console.error("No models found in the OBJ file.");
  process.exit(1);
}

let model: ObjFileParser.ObjModel;
if (objData.models.length == 1) {
  model = objData.models[0];
} else {
  const modelPrompt = await Enquirer.prompt<{ model: string }>({
    type: "select",
    name: "model",
    message: "Select a model:",
    choices: objData.models.map((model, index) => ({
      name: index.toString(),
      message: model.name,
    })),
  });

  model = objData.models[modelPrompt.model as unknown as number];
}

const equations = generateEquations(model);

await mkdir("dist/equations", { recursive: true });
await writeFile("dist/equations/vertices.txt", equations.vertices.join("\n"));
await writeFile("dist/equations/rotated-vertices.txt", equations.rotatedVertices.join("\n"));
await writeFile("dist/equations/faces.txt", equations.faces.join("\n"));

console.log('Done! Wrote to "dist" directory.');
