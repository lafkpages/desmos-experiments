import type { ObjFile } from "obj-file-parser";

const axes = ["x", "y", "z"] as const;
const otherAxes = {
  x: ["y", "z"],
  y: ["x", "z"],
  z: ["x", "y"],
} satisfies Record<(typeof axes)[number], [(typeof axes)[number], (typeof axes)[number]]>;

export interface GenerateEquationsOptions {}

export function generateEquations(
  file: ObjFile,
  modelIndex: number,
  options?: GenerateEquationsOptions,
) {
  const model = file.models[modelIndex];

  let vertexIndexOffset = 0;
  for (let i = 0; i < modelIndex; i++) {
    vertexIndexOffset += file.models[i].vertices.length;
  }

  return {
    vertices: axes.map(
      (axis) =>
        `${axis}_{0}=\\left[` + model.vertices.map((vertex) => vertex[axis]).join(",") + "\\right]",
    ),
    rotatedVertices: axes
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
      .flat(),
    faces: model.faces.map(
      (face) =>
        "\\operatorname{polygon}\\left(" +
        face.vertices
          .map((vertex) => {
            const vertexIndex = vertex.vertexIndex - vertexIndexOffset;

            let index: number;
            if (vertexIndex < 0) {
              index = model.vertices.length + vertexIndex;
            } else {
              index = vertexIndex;
            }

            return `p\\left[${index}\\right]`;
          })
          .join(",") +
        "\\right)",
    ),
  };
}
