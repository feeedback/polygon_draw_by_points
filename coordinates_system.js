/* eslint-disable camelcase */
import canvasLib from 'canvas';
// import saveCanvasToFileImage from './save-canvas-to-file-image.js';

const drawCoordinatesSystem = (
  canvasRaw,
  gridSize = 10,
  x_axis_distance_grid_lines = 0,
  y_axis_distance_grid_lines = 0,
  width = 200,
  height = 200,
  isLabel = false
) => {
  // const x_axis_starting_point = { number: 1, suffix: '\u03a0' };
  const x_axis_starting_point = { number: 1, suffix: '' };
  const y_axis_starting_point = { number: 1, suffix: '' };

  let canvas = canvasRaw;
  if (!canvas) {
    canvas = canvasLib.createCanvas(width, height, 'svg');
  }

  const ctx = canvas.getContext('2d');

  const canvas_width = canvas.width;
  const canvas_height = canvas.height;

  const num_lines_x = Math.floor(canvas_height / gridSize);
  const num_lines_y = Math.floor(canvas_width / gridSize);

  // Draw grid lines along X-axis
  for (let i = 0; i <= num_lines_x; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    // If line represents X-axis draw in different color
    if (i === x_axis_distance_grid_lines) ctx.strokeStyle = '#000000';
    else ctx.strokeStyle = '#e9e9e9';

    if (i === num_lines_x) {
      ctx.moveTo(0, gridSize * i);
      ctx.lineTo(canvas_width, gridSize * i);
    } else {
      ctx.moveTo(0, gridSize * i + 0.5);
      ctx.lineTo(canvas_width, gridSize * i + 0.5);
    }
    ctx.stroke();
  }

  // Draw grid lines along Y-axis
  for (let i = 0; i <= num_lines_y; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    // If line represents X-axis draw in different color
    if (i === y_axis_distance_grid_lines) ctx.strokeStyle = '#000000';
    else ctx.strokeStyle = '#e9e9e9';

    if (i === num_lines_y) {
      ctx.moveTo(gridSize * i, 0);
      ctx.lineTo(gridSize * i, canvas_height);
    } else {
      ctx.moveTo(gridSize * i + 0.5, 0);
      ctx.lineTo(gridSize * i + 0.5, canvas_height);
    }
    ctx.stroke();
  }

  // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
  ctx.translate(y_axis_distance_grid_lines * gridSize, x_axis_distance_grid_lines * gridSize);

  // Ticks marks along the positive X-axis
  for (let i = 1; i < num_lines_y - y_axis_distance_grid_lines; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';

    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(gridSize * i + 0.5, -3);
    ctx.lineTo(gridSize * i + 0.5, 3);
    ctx.stroke();

    if (isLabel) {
      // Text value at that point
      ctx.font = '9px Arial';
      ctx.textAlign = 'start';
      ctx.fillText(x_axis_starting_point.number * i + x_axis_starting_point.suffix, gridSize * i - 2, 15);
    }
  }

  // Ticks marks along the negative X-axis
  for (let i = 1; i < y_axis_distance_grid_lines; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';

    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(-gridSize * i + 0.5, -3);
    ctx.lineTo(-gridSize * i + 0.5, 3);
    ctx.stroke();

    if (isLabel) {
      // Text value at that point
      ctx.font = '9px Arial';
      ctx.textAlign = 'end';
      ctx.fillText(-x_axis_starting_point.number * i + x_axis_starting_point.suffix, -gridSize * i + 3, 15);
    }
  }

  // Ticks marks along the positive Y-axis
  // Positive Y-axis of graph is negative Y-axis of the canvas
  for (let i = 1; i < num_lines_x - x_axis_distance_grid_lines; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';

    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(-3, gridSize * i + 0.5);
    ctx.lineTo(3, gridSize * i + 0.5);
    ctx.stroke();

    if (isLabel) {
      // Text value at that point
      ctx.font = '9px Arial';
      ctx.textAlign = 'start';
      ctx.fillText(-y_axis_starting_point.number * i + y_axis_starting_point.suffix, 8, gridSize * i + 3);
    }
  }

  // Ticks marks along the negative Y-axis
  // Negative Y-axis of graph is positive Y-axis of the canvas
  for (let i = 1; i < x_axis_distance_grid_lines; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';

    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(-3, -gridSize * i + 0.5);
    ctx.lineTo(3, -gridSize * i + 0.5);
    ctx.stroke();

    if (isLabel) {
      // Text value at that point
      ctx.font = '9px Arial';
      ctx.textAlign = 'start';
      ctx.fillText(y_axis_starting_point.number * i + y_axis_starting_point.suffix, 8, -gridSize * i + 3);
    }
  }
  ctx.resetTransform();
  return canvas;
};

export default drawCoordinatesSystem;
// saveCanvasToFileImage(0, createMesh(), 'svg');
