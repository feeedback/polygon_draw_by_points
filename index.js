import { randomInt } from 'crypto';
import drawPolygonOnCanvas from './draw-polygon-canvas.js';
import saveCanvasToFileImage from './save-canvas-to-file-image.js';

const finishedCanvasImages = drawPolygonOnCanvas(
  new Array(10).fill(null).map((_, i) => ({ x: i, y: randomInt(i, 10) })),
  // [
  //   { x: 1, y: 2 },
  //   { x: 5, y: 5 },
  //   { x: 20, y: 5 },
  //   { x: 5, y: 7 },
  // ],
  'svg'
);
Promise.allSettled(
  finishedCanvasImages.map(({ figureIndex, canvas }) => saveCanvasToFileImage(figureIndex, canvas, 'svg'))
);
