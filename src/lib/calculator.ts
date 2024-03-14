const rotationSlider = {
  hardMin: true,
  hardMax: true,
  min: "0",
  max: "359",
  step: "1",
  isPlaying: true,
  loopMode: "LOOP_FORWARD",
};

export function setupCalculator(calculator: any) {
  calculator.setState({
    version: 10,
    graph: {
      degreeMode: true,
      viewport: {
        xmin: -5,
        xmax: 5,
      },
    },
    expressions: {
      list: [
        {
          type: "folder",
          id: "inputSettings",
          title: "Input settings",
        },
        {
          type: "expression",
          id: "Xrot",
          folderId: "inputSettings",
          latex: "X_{rot}=0",
          slider: rotationSlider,
        },
        {
          type: "expression",
          id: "Yrot",
          folderId: "inputSettings",
          latex: "Y_{rot}=0",
          slider: rotationSlider,
        },
        {
          type: "expression",
          id: "Zrot",
          folderId: "inputSettings",
          latex: "Z_{rot}=0",
          slider: rotationSlider,
        },
        {
          type: "expression",
          id: "F",
          folderId: "inputSettings",
          latex: "F=4",
          slider: {
            hardMin: true,
            hardMax: true,
            min: "1.8",
            max: "20",
            step: "0.1",
          },
        },
        {
          type: "folder",
          id: "input3DPoints",
          title: "Input 3D points",
          collapsed: true,
        },
        {
          type: "expression",
          id: "x0",
          folderId: "input3DPoints",
          latex: "x_{0}=\\left[1,1,1,1,-1,-1,-1,-1\\right]",
        },
        {
          type: "expression",
          id: "y0",
          folderId: "input3DPoints",
          latex: "y_{0}=\\left[1,-1,1,-1,1,-1,1,-1\\right]",
        },
        {
          type: "expression",
          id: "z0",
          folderId: "input3DPoints",
          latex: "z_{0}=\\left[-1,-1,1,1,-1,-1,1,1\\right]",
        },
        {
          type: "folder",
          id: "rotationFunctions",
          title: "Rotation functions",
          collapsed: true,
        },
        {
          type: "expression",
          id: "Rxy",
          folderId: "rotationFunctions",
          latex:
            "R_{xy}\\left(y,z,\\theta\\right)=y\\left(\\cos\\theta\\right)+z\\left(\\sin\\theta\\right)",
        },
        {
          type: "expression",
          id: "Rxz",
          folderId: "rotationFunctions",
          latex:
            "R_{xz}\\left(y,z,\\theta\\right)=y\\left(-\\sin\\theta\\right)+z\\left(\\cos\\theta\\right)",
        },
        {
          type: "expression",
          id: "Ryx",
          folderId: "rotationFunctions",
          latex:
            "R_{yx}\\left(x,z,\\theta\\right)=x\\left(\\cos\\theta\\right)+z\\left(-\\sin\\theta\\right)",
        },
        {
          type: "expression",
          id: "Ryz",
          folderId: "rotationFunctions",
          latex:
            "R_{yz}\\left(x,z,\\theta\\right)=x\\left(\\sin\\theta\\right)+z\\left(\\cos\\theta\\right)",
        },
        {
          type: "expression",
          id: "Rzx",
          folderId: "rotationFunctions",
          latex:
            "R_{zx}\\left(x,y,\\theta\\right)=x\\left(\\cos\\theta\\right)+y\\left(\\sin\\theta\\right)",
        },
        {
          type: "expression",
          id: "Rzy",
          folderId: "rotationFunctions",
          latex:
            "R_{zy}\\left(x,y,\\theta\\right)=x\\left(-\\sin\\theta\\right)+y\\left(\\cos\\theta\\right)",
        },
        {
          type: "folder",
          id: "projectorFunctions",
          title: "Projector functions",
          collapsed: true,
        },
        {
          type: "expression",
          id: "Px",
          folderId: "projectorFunctions",
          latex: "P_{x}\\left(x,z\\right)=F\\cdot\\frac{x}{F+z}",
        },
        {
          type: "expression",
          id: "Py",
          folderId: "projectorFunctions",
          latex: "P_{y}\\left(y,z\\right)=F\\cdot\\frac{y}{F+z}",
        },
        {
          type: "folder",
          id: "rotatedPoints",
          title: "Rotated points",
          collapsed: true,
        },
        {
          type: "expression",
          id: "x1",
          folderId: "rotatedPoints",
          latex: "x_{1}=x_{0}",
        },
        {
          type: "expression",
          id: "y1",
          folderId: "rotatedPoints",
          latex:
            "y_{1}=\\left[R_{xy}\\left(y_{0}\\left[1\\right],z_{0}\\left[1\\right],X_{rot}\\right),R_{xy}\\left(y_{0}\\left[2\\right],z_{0}\\left[2\\right],X_{rot}\\right),R_{xy}\\left(y_{0}\\left[3\\right],z_{0}\\left[3\\right],X_{rot}\\right),R_{xy}\\left(y_{0}\\left[4\\right],z_{0}\\left[4\\right],X_{rot}\\right),R_{xy}\\left(y_{0}\\left[5\\right],z_{0}\\left[5\\right],X_{rot}\\right),R_{xy}\\left(y_{0}\\left[6\\right],z_{0}\\left[6\\right],X_{rot}\\right),R_{xy}\\left(y_{0}\\left[7\\right],z_{0}\\left[7\\right],X_{rot}\\right),R_{xy}\\left(y_{0}\\left[8\\right],z_{0}\\left[8\\right],X_{rot}\\right)\\right]",
        },
        {
          type: "expression",
          id: "z1",
          folderId: "rotatedPoints",
          latex:
            "z_{1}=\\left[R_{xz}\\left(y_{0}\\left[1\\right],z_{0}\\left[1\\right],X_{rot}\\right),R_{xz}\\left(y_{0}\\left[2\\right],z_{0}\\left[2\\right],X_{rot}\\right),R_{xz}\\left(y_{0}\\left[3\\right],z_{0}\\left[3\\right],X_{rot}\\right),R_{xz}\\left(y_{0}\\left[4\\right],z_{0}\\left[4\\right],X_{rot}\\right),R_{xz}\\left(y_{0}\\left[5\\right],z_{0}\\left[5\\right],X_{rot}\\right),R_{xz}\\left(y_{0}\\left[6\\right],z_{0}\\left[6\\right],X_{rot}\\right),R_{xz}\\left(y_{0}\\left[7\\right],z_{0}\\left[7\\right],X_{rot}\\right),R_{xz}\\left(y_{0}\\left[8\\right],z_{0}\\left[8\\right],X_{rot}\\right)\\right]",
        },
        {
          type: "expression",
          id: "x2",
          folderId: "rotatedPoints",
          latex:
            "x_{2}=\\left[R_{yx}\\left(x_{1}\\left[1\\right],z_{1}\\left[1\\right],Y_{rot}\\right),R_{yx}\\left(x_{1}\\left[2\\right],z_{1}\\left[2\\right],Y_{rot}\\right),R_{yx}\\left(x_{1}\\left[3\\right],z_{1}\\left[3\\right],Y_{rot}\\right),R_{yx}\\left(x_{1}\\left[4\\right],z_{1}\\left[4\\right],Y_{rot}\\right),R_{yx}\\left(x_{1}\\left[5\\right],z_{1}\\left[5\\right],Y_{rot}\\right),R_{yx}\\left(x_{1}\\left[6\\right],z_{1}\\left[6\\right],Y_{rot}\\right),R_{yx}\\left(x_{1}\\left[7\\right],z_{1}\\left[7\\right],Y_{rot}\\right),R_{yx}\\left(x_{1}\\left[8\\right],z_{1}\\left[8\\right],Y_{rot}\\right)\\right]",
        },
        {
          type: "expression",
          id: "y2",
          folderId: "rotatedPoints",
          latex: "y_{2}=y_{1}",
        },
        {
          type: "expression",
          id: "z2",
          folderId: "rotatedPoints",
          latex:
            "z_{2}=\\left[R_{yz}\\left(x_{1}\\left[1\\right],z_{1}\\left[1\\right],Y_{rot}\\right),R_{yz}\\left(x_{1}\\left[2\\right],z_{1}\\left[2\\right],Y_{rot}\\right),R_{yz}\\left(x_{1}\\left[3\\right],z_{1}\\left[3\\right],Y_{rot}\\right),R_{yz}\\left(x_{1}\\left[4\\right],z_{1}\\left[4\\right],Y_{rot}\\right),R_{yz}\\left(x_{1}\\left[5\\right],z_{1}\\left[5\\right],Y_{rot}\\right),R_{yz}\\left(x_{1}\\left[6\\right],z_{1}\\left[6\\right],Y_{rot}\\right),R_{yz}\\left(x_{1}\\left[7\\right],z_{1}\\left[7\\right],Y_{rot}\\right),R_{yz}\\left(x_{1}\\left[8\\right],z_{1}\\left[8\\right],Y_{rot}\\right)\\right]",
        },
        {
          type: "expression",
          id: "x3",
          folderId: "rotatedPoints",
          latex:
            "x_{3}=\\left[R_{zx}\\left(x_{2}\\left[1\\right],y_{2}\\left[1\\right],Z_{rot}\\right),R_{zx}\\left(x_{2}\\left[2\\right],y_{2}\\left[2\\right],Z_{rot}\\right),R_{zx}\\left(x_{2}\\left[3\\right],y_{2}\\left[3\\right],Z_{rot}\\right),R_{zx}\\left(x_{2}\\left[4\\right],y_{2}\\left[4\\right],Z_{rot}\\right),R_{zx}\\left(x_{2}\\left[5\\right],y_{2}\\left[5\\right],Z_{rot}\\right),R_{zx}\\left(x_{2}\\left[6\\right],y_{2}\\left[6\\right],Z_{rot}\\right),R_{zx}\\left(x_{2}\\left[7\\right],y_{2}\\left[7\\right],Z_{rot}\\right),R_{zx}\\left(x_{2}\\left[8\\right],y_{2}\\left[8\\right],Z_{rot}\\right)\\right]",
        },
        {
          type: "expression",
          id: "y3",
          folderId: "rotatedPoints",
          latex:
            "y_{3}=\\left[R_{zy}\\left(x_{2}\\left[1\\right],y_{2}\\left[1\\right],Z_{rot}\\right),R_{zy}\\left(x_{2}\\left[2\\right],y_{2}\\left[2\\right],Z_{rot}\\right),R_{zy}\\left(x_{2}\\left[3\\right],y_{2}\\left[3\\right],Z_{rot}\\right),R_{zy}\\left(x_{2}\\left[4\\right],y_{2}\\left[4\\right],Z_{rot}\\right),R_{zy}\\left(x_{2}\\left[5\\right],y_{2}\\left[5\\right],Z_{rot}\\right),R_{zy}\\left(x_{2}\\left[6\\right],y_{2}\\left[6\\right],Z_{rot}\\right),R_{zy}\\left(x_{2}\\left[7\\right],y_{2}\\left[7\\right],Z_{rot}\\right),R_{zy}\\left(x_{2}\\left[8\\right],y_{2}\\left[8\\right],Z_{rot}\\right)\\right]",
        },
        {
          type: "expression",
          id: "z3",
          folderId: "rotatedPoints",
          latex: "z_{3}=z_{2}",
        },
        {
          type: "folder",
          id: "projectedPoints",
          title: "Projected points",
          collapsed: true,
        },
        {
          type: "expression",
          id: "px",
          folderId: "projectedPoints",
          latex: "p_{x}=P_{x}\\left(x_{3},z_{3}\\right)",
        },
        {
          type: "expression",
          id: "py",
          folderId: "projectedPoints",
          latex: "p_{y}=P_{y}\\left(y_{3},z_{3}\\right)",
        },
        {
          type: "expression",
          id: "p",
          folderId: "projectedPoints",
          latex: "p=\\left(p_{x},p_{y}\\right)",
        },
        {
          id: "ptable",
          type: "table",
          folderId: "projectedPoints",
          columns: [
            {
              id: "ptable_x",
              latex: "p_{x}",
            },
            {
              hidden: true,
              id: "ptable_y",
              latex: "p_{y}",
            },
          ],
        },
        {
          type: "folder",
          id: "projectedFaces",
          title: "Projected faces",
          collapsed: true,
        },
        {
          type: "expression",
          id: "face1",
          folderId: "projectedFaces",
          latex:
            "\\operatorname{polygon}\\left(p\\left[1\\right],p\\left[5\\right],p\\left[7\\right],p\\left[3\\right]\\right)",
        },
        {
          type: "expression",
          id: "face2",
          folderId: "projectedFaces",
          latex:
            "\\operatorname{polygon}\\left(p\\left[4\\right],p\\left[3\\right],p\\left[7\\right],p\\left[8\\right]\\right)",
        },
        {
          type: "expression",
          id: "face3",
          folderId: "projectedFaces",
          latex:
            "\\operatorname{polygon}\\left(p\\left[8\\right],p\\left[7\\right],p\\left[5\\right],p\\left[6\\right]\\right)",
        },
        {
          type: "expression",
          id: "face4",
          folderId: "projectedFaces",
          latex:
            "\\operatorname{polygon}\\left(p\\left[6\\right],p\\left[2\\right],p\\left[4\\right],p\\left[8\\right]\\right)",
        },
        {
          type: "expression",
          id: "face5",
          folderId: "projectedFaces",
          latex:
            "\\operatorname{polygon}\\left(p\\left[2\\right],p\\left[1\\right],p\\left[3\\right],p\\left[4\\right]\\right)",
        },
        {
          type: "expression",
          id: "face6",
          folderId: "projectedFaces",
          latex:
            "\\operatorname{polygon}\\left(p\\left[6\\right],p\\left[5\\right],p\\left[1\\right],p\\left[2\\right]\\right)",
        },
      ],
    },
  });
}
