import nodeCanvas from 'canvas';

export const drawPointLabel = (ctx, pointX, pointY, label, pointSize, textSizeChar, textSizeCoord) => {
  ctx.resetTransform();

  const textX = pointX;
  const textY = ctx.canvas.height - Math.round(pointY - pointSize - 3);

  const labelChar = label.slice(0, 1);
  const restLabel = label.slice(1);
  ctx.textBaseline = 'bottom';
  ctx.font = `bold ${textSizeChar}px Arial`;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.textAlign = 'right';
  ctx.fillText(labelChar, textX, textY - textSizeChar / 2);
  // const widthChar = ctx.measureText(labelChar).width;

  if (textSizeCoord >= 4) {
    ctx.font = `${textSizeCoord}px Arial`;
    ctx.fillStyle = `rgba(9, 9, 9, 0.75+${(Math.sqrt(textSizeCoord - 4) * 9) / 100})`;
    ctx.textAlign = 'left';
    ctx.fillText(restLabel, textX, textY - (textSizeChar * 1.05 - textSizeCoord - 1) - textSizeCoord / 2);
  }

  ctx.translate(0, ctx.canvas.height);
  ctx.scale(1, -1);
};

export const drawPoint = (
  ctx,
  x,
  y,
  label,
  color = '#000',
  pointSize = 3,
  textSizeChar = 14,
  textSizeCoord = 12
) => {
  const pointX = Math.round(x);
  const pointY = Math.round(y);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(pointX, pointY, pointSize, 0 * Math.PI, 2 * Math.PI);
  ctx.fill();

  if (label) {
    drawPointLabel(ctx, pointX, pointY, label, pointSize, textSizeChar, textSizeCoord);
  }
};

export const drawFigure = (ctx, ...points) => {
  ctx.beginPath();
  const [startPoints, ...restPoints] = points;

  ctx.moveTo(startPoints.x, startPoints.y);

  for (const point of restPoints) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.closePath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgb(0, 50, 0)';
  ctx.stroke();
  ctx.fillStyle = 'rgba(0, 255, 0, 0.22)';
  ctx.fill();
};

export const generateLabelsToVerticles = (points) => {
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

export function createFnZoom(shiftXY, zoomRatio) {
  return ({ x = 0, y = 0 }) => ({ x: (x - shiftXY.x) * zoomRatio, y: (y - shiftXY.y) * zoomRatio });
}

export const nodeCanvasCreate = (width, height, type) => nodeCanvas.createCanvas(width, height, type);
