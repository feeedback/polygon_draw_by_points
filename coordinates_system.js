/* eslint-disable camelcase */
import nodeCanvas from 'canvas';
// import saveCanvasToFileImage from './save-canvas-to-file-image.js';

const drawCoordinatesSystem = (
  canvasRaw = null,
  gridSize = 10,
  startDrawPoint = { x: 0, y: 0 },
  x_axis_distance_grid_lines = 0,
  y_axis_distance_grid_lines = 0,
  width = 200,
  height = 200,
  isLabel = false
) => {
  // const x_axis_starting_point = { number: 1, suffix: '\u03a0' };
  const x_axis_starting_point = { number: 1, suffix: '' };
  const y_axis_starting_point = { number: 1, suffix: '' };

  const canvas = canvasRaw || nodeCanvas.createCanvas(width, height, 'svg');

  const ctx = canvas.getContext('2d');
  ctx.resetTransform();

  const canvas_width = canvas.width;
  const canvas_height = canvas.height;

  const num_lines_x = Math.floor(canvas_height / gridSize);
  const num_lines_y = Math.floor(canvas_width / gridSize);

  // Draw grid lines along X-axis
  for (let x = 0; x <= num_lines_x; x++) {
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = x === x_axis_distance_grid_lines ? '#000000AA' : '#e9e9e9';

    ctx.moveTo(startDrawPoint.x, startDrawPoint.y + gridSize * x);
    ctx.lineTo(startDrawPoint.x + canvas_width, startDrawPoint.y + gridSize * x);

    ctx.stroke();
  }

  // Draw grid lines along Y-axis
  for (let y = 0; y <= num_lines_y; y++) {
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = y === y_axis_distance_grid_lines ? '#000000AA' : '#e9e9e9';

    ctx.moveTo(startDrawPoint.x + gridSize * y, startDrawPoint.y);
    ctx.lineTo(startDrawPoint.x + gridSize * y, startDrawPoint.y + canvas_height);
    ctx.stroke();
  }

  // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph.
  // So the y-coordinate of each element will be negative of the actual
  // ctx.translate(
  //   startDrawPoint.y + y_axis_distance_grid_lines * gridSize,
  //   startDrawPoint.x + x_axis_distance_grid_lines * gridSize
  // );

  ctx.resetTransform();
  return canvas;
};

export default drawCoordinatesSystem;
