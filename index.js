import drawPolygonOnCanvas from './src/draw-polygon-canvas.js';
import saveCanvasToFileImage from './src/save-canvas-to-file-image.js';
import { createFigure } from './src/utils/utils.js';

const finishedCanvasImages = drawPolygonOnCanvas([createFigure(3), createFigure(4)], 'png');

Promise.allSettled(
  finishedCanvasImages.map(({ figureIndex, canvas }) => saveCanvasToFileImage(figureIndex, canvas, 'png'))
);
