import { randomInt } from 'crypto';
import drawPolygonOnCanvas from './draw-polygon-canvas.js';
import saveCanvasToFileImage from './save-canvas-to-file-image.js';

const finishedCanvasImages = drawPolygonOnCanvas(
  // new Array(52).fill(null).map((_, i) => ({ x: randomInt(i, 10 * (i + 1)), y: randomInt(i, 10 * (i + 1)) })),
  // new Array(52).fill(null).map((_, i) => ({ x: randomInt(i, 10 * (i + 1)), y: randomInt(i, 10 * (i + 1)) })),
  // new Array(8).fill(null).map((_, i) => ({ x: randomInt(0, 100), y: randomInt(0, 100) })),
  // new Array(28).fill(null).map((_, i) => ({ x: randomInt(0, 200), y: randomInt(0, 100) })),
  new Array(8).fill(null).map((_, i) => ({ x: randomInt(-30, 30), y: randomInt(-20, 20) })),
  // new Array(3).fill(null).map((_, i) => ({ x: randomInt(-30, 30), y: randomInt(-20, 20) })),
  // [
  //   { x: 1, y: 2 },
  //   { x: 5, y: 5 },
  //   { x: 20, y: 5 },
  //   { x: 5, y: 7 },
  // ],
  'svg',
  1,
  10,
  6
);
Promise.allSettled(
  finishedCanvasImages.map(({ figureIndex, canvas }) => saveCanvasToFileImage(figureIndex, canvas, 'svg'))
);
