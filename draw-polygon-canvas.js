/* eslint-disable no-param-reassign */
import nodeCanvas from 'canvas';
import drawCoordinatesSystem from './coordinates_system.js';

function drawPoint(ctx, x, y, label, color = '#000', pointSize = 5, textSizeChar = 14, textSizeCoord = 10) {
  const pointX = Math.round(x);
  const pointY = Math.round(y);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(pointX, pointY, pointSize, 0 * Math.PI, 2 * Math.PI);
  ctx.fill();

  if (label) {
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.resetTransform();
    // ctx.translate(0, -ctx.canvas.height);
    // ctx.scale(-1, 0);
    const textX = pointX;
    const textY = ctx.canvas.height - Math.round(pointY - pointSize - 3);

    const labelChar = label.slice(0, 1);
    const restLabel = label.slice(1);
    // ctx.textBaseline = 'middle';
    ctx.textBaseline = 'bottom';
    ctx.font = `bold ${textSizeChar}px Arial`;
    // ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.textAlign = 'right';
    ctx.fillText(labelChar, textX, textY - textSizeChar / 2);
    // const widthChar = ctx.measureText(labelChar).width;
    if (textSizeCoord >= 4) {
      ctx.font = `${textSizeCoord}px Arial`;
      ctx.fillStyle = `rgba(9, 9, 9, 0.7+${(Math.sqrt(textSizeCoord - 4) * 9) / 100})`;
      ctx.textAlign = 'left';
      ctx.fillText(restLabel, textX, textY - (textSizeChar * 1.05 - textSizeCoord - 1) - textSizeCoord / 2);
    }
    ctx.translate(0, ctx.canvas.height);
    ctx.scale(1, -1);
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

const canvasCreate = (width, height, type) => nodeCanvas.createCanvas(width, height, type);

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
  ctx.strokeStyle = 'rgb(0, 50, 0)';
  ctx.stroke();
  ctx.fillStyle = 'rgba(0, 255, 0, 0.25)';
  ctx.fill();
};

const generateLabelsToVerticles = (points) => {
  const labels = {};
  const labelinit = 'A'.charCodeAt(); // const nameInit = 'a'.charCodeAt()

  for (let index = 0; index < points.length; index++) {
    let label = String.fromCharCode(labelinit + (index % 26));

    if (index >= 26) {
      label += '"'.repeat(Math.floor(index / 26)); // '`"'´'
    }
    // eslint-disable-next-line no-irregular-whitespace
    labels[index] = `${label} (${points[index].x}, ${points[index].y})`;
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
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // чтобы рисовать с нижнего левого угла
  // но этим способом текст трансформируется
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);

  drawCoordinatesSystem(canvas, zoomRatio, startXY);

  return { canvas, ctx, zoomedPoints, labels };
};

/**
 * Draw polygon from points coordinates and generate image file (path img/figure_[index]_[hh_mm_ss].[ext])
 *
 * @param {Array< {x:number,y:number} | {x:number,y:number}[] >} figures
 * @param { 'svg'|'png'|'jpeg'|'jpegLow' } [typeFileOutput='svg']
 * @return {Promise<undefined>}
 */
function drawPolygonOnCanvas(figuresRaw, typeFileOutput, pointSize, textSizeChar, textSizeCoord) {
  let figures = figuresRaw;
  if (!Array.isArray(figuresRaw[0])) {
    figures = [figuresRaw];
  }

  const finishedCanvasImages = [];
  for (let figureIndex = 0; figureIndex < figures.length; figureIndex++) {
    const points = figures[figureIndex];
    const { canvas, ctx, zoomedPoints, labels } = canvasInit(points, typeFileOutput);
    if (points.length >= 50) {
      [pointSize, textSizeChar, textSizeCoord] = [1, 8, 0];
    } else if (points.length >= 26) {
      [pointSize, textSizeChar, textSizeCoord] = [1.5, 10, 6];
    } else if (points.length >= 16) {
      [pointSize, textSizeChar, textSizeCoord] = [1.5, 11, 8];
    } else if (points.length >= 10) {
      [pointSize, textSizeChar, textSizeCoord] = [2, 12, 8];
    } else if (points.length >= 5) {
      [pointSize, textSizeChar, textSizeCoord] = [3, 14, 12];
    } else {
      [pointSize, textSizeChar, textSizeCoord] = [3, 16, 12];
    }
    drawFigure(ctx, ...zoomedPoints);

    for (let index = 0; index < zoomedPoints.length; index++) {
      const point = zoomedPoints[index];
      const label = labels[index];

      drawPoint(ctx, point.x, point.y, label, 'black', pointSize, textSizeChar, textSizeCoord);
    }
    finishedCanvasImages.push({ figureIndex, canvas });
  }
  return finishedCanvasImages;
}

export default drawPolygonOnCanvas;
