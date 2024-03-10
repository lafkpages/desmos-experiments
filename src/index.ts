import { readFile } from "node:fs/promises";

import OBJFile from "obj-file-parser";

import { filePath, modelName } from "./inputs";

const fileContents = await readFile(filePath, "utf-8");

const objFile = new OBJFile(fileContents);
const objData = objFile.parse();

const model = objData.models.find((model) => model.name == modelName);

if (!model) {
  console.error(`Model "${modelName}" not found.`);
  console.error(
    "Available models:",
    objData.models.map((model) => model.name).join(", "),
  );
  process.exit(1);
}

console.log(
  "Vertices:",
  "\n\n" +
    (["x", "y", "z"] as const)
      .map(
        (axis) =>
          `${axis}_{0}=\\left[` +
          model.vertices.map((vertex) => vertex[axis]).join(",") +
          "\\right]",
      )
      .join("\n\n") +
    "\n\n",
);

console.log(
  "Rotated vertices:",
  "\n\n" +
    (["x", "y", "z"] as const)
      .map((rotationAxis, rotationAxisIndex) =>
        (["x", "y", "z"] as const).map(
          (axis, axisIndex) =>
            `${axis}_{${rotationAxisIndex + 1}}=\\left[` +
            model.vertices
              .map(
                (_, i) =>
                  `R_{${rotationAxis}}\\left(x_{${rotationAxisIndex}}\\left[${i + 1}\\right],y_{${rotationAxisIndex}}\\left[${i + 1}\\right],z_{${rotationAxisIndex}}\\left[${i + 1}\\right],${rotationAxis.toUpperCase()}_{rot}\\right)\\left[${axisIndex + 1}\\right]`,
              )
              .join(",") +
            "\\right]",
        ),
      )
      .flat()
      .join("\n\n") +
    "\n\n",
);

console.log(
  "Faces:",
  "\n" +
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
