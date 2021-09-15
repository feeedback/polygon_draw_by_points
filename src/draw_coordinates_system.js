import { nodeCanvasCreate } from './utils/canvas_utils.js';

const drawCoordinatesSystem = (
  canvasRaw = null,
  gridSize = 10,
  startDrawPoint = { x: 0, y: 0 },
  xAxisDistanceGridLines = 0,
  yAxisDistanceGridLines = 0,
  width = 200,
  height = 200
) => {
  const canvas = canvasRaw || nodeCanvasCreate(width, height, 'svg');
  const ctx = canvas.getContext('2d');
  // ctx.resetTransform();

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const numLinesX = Math.floor(canvasHeight / gridSize);
  const numLinesY = Math.floor(canvasWidth / gridSize);

  // Draw grid lines along X-axis
  for (let x = 0; x <= numLinesX; x++) {
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = x === xAxisDistanceGridLines ? '#99999977' : '#e9e9e9bb';

    ctx.moveTo(startDrawPoint.x, startDrawPoint.y + gridSize * x);
    ctx.lineTo(startDrawPoint.x + canvasWidth, startDrawPoint.y + gridSize * x);

    ctx.stroke();
  }

  // Draw grid lines along Y-axis
  for (let y = 0; y <= numLinesY; y++) {
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = y === yAxisDistanceGridLines ? '#99999977' : '#e9e9e9bb';

    ctx.moveTo(startDrawPoint.x + gridSize * y, startDrawPoint.y);
    ctx.lineTo(startDrawPoint.x + gridSize * y, startDrawPoint.y + canvasHeight);
    ctx.stroke();
  }

  return canvas;
};

export default drawCoordinatesSystem;
