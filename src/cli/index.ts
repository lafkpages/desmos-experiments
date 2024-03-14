import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join as joinPaths } from "node:path";

import { generateEquations } from "$lib";
import Enquirer from "enquirer";

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

const equations = generateEquations(fileContents);

await mkdir("dist/equations", { recursive: true });
await writeFile("dist/equations/vertices.txt", equations.vertices.join("\n"));
await writeFile("dist/equations/rotated-vertices.txt", equations.rotatedVertices.join("\n"));
await writeFile("dist/equations/faces.txt", equations.faces.join("\n"));

console.log('Done! Wrote to "dist" directory.');
