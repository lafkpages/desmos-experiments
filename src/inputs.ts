import { homedir } from "node:os";
import { join as joinPaths } from "node:path";

const homeDir = homedir();

export const filePath = joinPaths(homeDir, "Downloads/untitled.obj");
export const modelName = "Icosphere";
