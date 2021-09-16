import drawPolygonOnCanvas from './draw-polygon-canvas.js';
import saveCanvasToFileImage from './save-canvas-to-file-image.js';
// import { createFigure } from './src/utils/utils.js';

const drawPolygonAndSaveToFile = (points, format, filepath) =>
  Promise.allSettled(
    drawPolygonOnCanvas(points, format).map(({ figureIndex, canvas }) =>
      saveCanvasToFileImage(figureIndex, canvas, format, filepath)
    )
  );

export default drawPolygonAndSaveToFile;
