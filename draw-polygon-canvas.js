import canvasLib from 'canvas';
// import { randomInt } from 'crypto';
import drawCoordinatesSystem from './coordinates_system.js';

function drawPoint(ctx, x, y, label, color = '#000', size = 5) {
  const pointX = Math.round(x);
  const pointY = Math.round(y);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(pointX, pointY, size, 0 * Math.PI, 2 * Math.PI);
  ctx.fill();

  if (label) {
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ctx.resetTransform();
    // ctx.translate(0, -ctx.canvas.height);
    // ctx.scale(-1, 0);
    const textX = pointX;
    const textY = Math.round(pointY - size - 3);

    const labelChar = label.slice(0, 1);
    const restLabel = label.slice(1);
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.textAlign = 'right';
    ctx.fillText(labelChar, textX, textY);
    // const widthChar = ctx.measureText(labelChar).width;

    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.textAlign = 'left';
    ctx.fillText(restLabel, textX, textY);

    // ctx.translate(0, ctx.canvas.height);
    // ctx.scale(1, -1);
  }
}

const getDist = (a, b) => Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
const getMinXY = (points) => {
  const min = {
    x: Math.min(...points.map(({ x, y }) => x)),
    y: Math.min(...points.map(({ x, y }) => y)),
  };
  const max = {
    x: Math.max(...points.map(({ x, y }) => x)),
    y: Math.max(...points.map(({ x, y }) => y)),
  };
  return { min, max };
};

const canvasCreate = (width, height, type) => canvasLib.createCanvas(width, height, type);

const drawFigure = (ctx, ...points) => {
  ctx.beginPath();
  const [startPoints, ...restPoints] = points;

  ctx.moveTo(startPoints.x, startPoints.y);

  for (const point of restPoints) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.closePath();
  ctx.lineWidth = 1;
  // ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
  // ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
  ctx.strokeStyle = 'rgb(0, 30, 0)';
  ctx.stroke();
  ctx.fillStyle = 'rgba(0, 255,0, 0.3)';
  ctx.fill();
};

const generateLabelsToVerticles = (points) => {
  const labels = {};
  const labelinit = 'A'.charCodeAt(); // const nameInit = 'a'.charCodeAt()

  for (let index = 0; index < points.length; index++) {
    labels[index] = `${String.fromCharCode(labelinit + index)} (${points[index].x}, ${points[index].y})`;
  }

  return labels;
};

function createFnZoom(shiftXY, zoomRatio) {
  return ({ x = 0, y = 0 }) => ({ x: (x - shiftXY.x) * zoomRatio, y: (y - shiftXY.y) * zoomRatio });
}

const canvasInit = (points, typeFileOutput = 'svg') => {
  const minAndMax = getMinXY(points);
  const maxSide = getDist(minAndMax.min, minAndMax.max) || 1;

  const zoomRatio = 750 / 1.1 / (96 / 72) / maxSide;
  const labels = generateLabelsToVerticles(points);

  const maxLengthLabels = Math.max(...Object.values(labels).map((l) => l.length));
  const startXY = { x: 10 + 2 * maxLengthLabels, y: 20 + 16 };
  const shiftXY = { x: minAndMax.min.x - startXY.x / zoomRatio, y: minAndMax.min.y - startXY.y / zoomRatio };

  const getZoomed = createFnZoom(shiftXY, zoomRatio);
  const zoomedPoints = points.map(getZoomed);

  const canvas = canvasCreate(
    getZoomed(minAndMax.max).x + startXY.x + 4 * maxLengthLabels,
    getZoomed(minAndMax.max).y + startXY.y - 16 / 2,
    typeFileOutput
  );
  // drawCoordinatesSystem(canvas, zoomRatio, zoomedPoints[0].x / zoomRatio, zoomedPoints[0].y / zoomRatio);
  drawCoordinatesSystem(canvas, zoomRatio, 0, 0);
  // drawCoordinatesSystem(canvas, 2, 0, 0);
  const ctx = canvas.getContext('2d');
  // чтобы рисовать с нижнего левого угла
  // но этим способом текст трансформируется
  // ctx.translate(0, canvas.height);
  // ctx.scale(1, -1);

  // ctx.fillStyle = 'white';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  return { canvas, ctx, zoomedPoints, labels };
};

/**
 * Draw polygon from points coordinates and generate image file (path img/figure_[index]_[hh_mm_ss].[ext])
 *
 * @param {Array< {x:number,y:number} | {x:number,y:number}[] >} figures
 * @param { 'svg'|'png'|'jpeg'|'jpegLow' } [typeFileOutput='svg']
 * @return {Promise<undefined>}
 */
function drawPolygonOnCanvas(figuresRaw, typeFileOutput) {
  let figures = figuresRaw;
  if (!Array.isArray(figuresRaw[0])) {
    figures = [figuresRaw];
  }

  const finishedCanvasImages = [];
  for (let figureIndex = 0; figureIndex < figures.length; figureIndex++) {
    const points = figures[figureIndex];
    const { canvas, ctx, zoomedPoints, labels } = canvasInit(points, typeFileOutput);

    drawFigure(ctx, ...zoomedPoints);

    for (let index = 0; index < zoomedPoints.length; index++) {
      const point = zoomedPoints[index];
      const label = labels[index];

      drawPoint(ctx, point.x, point.y, label, 'black', 3);
    }
    finishedCanvasImages.push({ figureIndex, canvas });
  }
  return finishedCanvasImages;
}

export default drawPolygonOnCanvas;
