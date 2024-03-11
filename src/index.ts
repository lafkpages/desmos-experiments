import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join as joinPaths } from "node:path";

import Enquirer from "enquirer";
import OBJFile from "obj-file-parser";

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

const objFile = new OBJFile(fileContents);
const objData = objFile.parse();

if (objData.models.length == 0) {
  console.error("OBJ file has no models.");
  process.exit(1);
}

let model: OBJFile.ObjModel;

if (objData.models.length == 1) {
  model = objData.models[0];
} else {
  const modelPrompt = await Enquirer.prompt<{ model: string }>({
    type: "select",
    name: "model",
    message: "OBJ file has more than one model. Please select a model:",
    choices: objData.models.map((model) => model.name),
  });

  model = objData.models.find((model) => model.name == modelPrompt.model)!;
}

const axes = ["x", "y", "z"] as const;
const otherAxes = {
  x: ["y", "z"],
  y: ["x", "z"],
  z: ["x", "y"],
} satisfies Record<
  (typeof axes)[number],
  [(typeof axes)[number], (typeof axes)[number]]
>;

await Bun.write(
  "dist/vertices.txt",
  axes
    .map(
      (axis) =>
        `${axis}_{0}=\\left[` +
        model.vertices.map((vertex) => vertex[axis]).join(",") +
        "\\right]",
    )
    .join("\n\n"),
);

await Bun.write(
  "dist/rotated-vertices.txt",
  axes
    .map((rotationAxis, rotationAxisIndex) =>
      axes.map((axis, axisIndex) =>
        axis == rotationAxis
          ? `${axis}_{${axisIndex + 1}}=${axis}_{${axisIndex}}`
          : `${axis}_{${rotationAxisIndex + 1}}=\\left[` +
            model.vertices
              .map(
                (_, i) =>
                  `R_{${rotationAxis}${axis}}\\left(${otherAxes[rotationAxis][0]}_{${rotationAxisIndex}}\\left[${i + 1}\\right],${otherAxes[rotationAxis][1]}_{${rotationAxisIndex}}\\left[${i + 1}\\right],${rotationAxis.toUpperCase()}_{rot}\\right)`,
              )
              .join(",") +
            "\\right]",
      ),
    )
    .flat()
    .join("\n\n"),
);

await Bun.write(
  "dist/faces.txt",
  model.faces
    .map(
      (face) =>
        "\\operatorname{polygon}\\left(" +
        face.vertices
          .map((vertex) => {
            let index: number;
            if (vertex.vertexIndex < 0) {
              index = model.vertices.length + vertex.vertexIndex;
            } else {
              index = vertex.vertexIndex;
            }

            return `p\\left[${index}\\right]`;
          })
          .join(",") +
        "\\right)",
    )
    .join("\n"),
);

console.log('Done! Wrote to "dist" directory.');
