/* eslint-disable no-param-reassign */
import drawCoordinatesSystem from './draw_coordinates_system.js';
import { getDist, getMinXYFromPoints, toPrecision2 } from './utils/utils.js';
import {
  nodeCanvasCreate,
  createFnZoom,
  drawPoint,
  drawFigure,
  generateLabelsToVerticles,
} from './utils/canvas_utils.js';

const canvasInit = (points, typeFileOutput = 'svg') => {
  const minAndMax = getMinXYFromPoints(points);
  const maxSide = getDist(minAndMax.min, minAndMax.max) || 1;

  const zoomRatio = 800 / 1.1 / (96 / 72) / maxSide;
  const labels = generateLabelsToVerticles(points);

  const maxLengthLabels = Math.max(...Object.values(labels).map((l) => l.length));

  const startXY = { x: 10 + 1 * maxLengthLabels, y: 16 };
  const shiftXY = { x: minAndMax.min.x - startXY.x / zoomRatio, y: minAndMax.min.y - startXY.y / zoomRatio };

  const getZoomed = createFnZoom(shiftXY, zoomRatio);
  const zoomedPoints = points.map(getZoomed);

  const width = getZoomed(minAndMax.max).x + startXY.x + (points.length < 6 ? 4.7 : 3.5) * maxLengthLabels;
  const height = getZoomed(minAndMax.max).y + startXY.y + 6;

  const canvas = nodeCanvasCreate(width, height, typeFileOutput);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // чтобы рисовать с нижнего левого угла
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);

  if (zoomRatio >= 4) {
    drawCoordinatesSystem(canvas, zoomRatio, startXY);
  }

  return { canvas, ctx, zoomedPoints, labels };
};

const getStyleDependsOnPointsNumber = (
  pointsNumber,
  pointSizeParam,
  textSizeCharParam,
  textSizeCoordParam
) => {
  let pointSize;
  let textSizeChar;
  let textSizeCoord;

  if (pointsNumber >= 50) {
    [pointSize, textSizeChar, textSizeCoord] = [1, 8, 0];
  } else if (pointsNumber >= 26) {
    [pointSize, textSizeChar, textSizeCoord] = [1.5, 10, 6];
  } else if (pointsNumber >= 16) {
    [pointSize, textSizeChar, textSizeCoord] = [1.5, 11, 8];
  } else if (pointsNumber >= 10) {
    [pointSize, textSizeChar, textSizeCoord] = [2, 12, 8];
  } else if (pointsNumber >= 5) {
    [pointSize, textSizeChar, textSizeCoord] = [3, 14, 12];
  } else {
    [pointSize, textSizeChar, textSizeCoord] = [3, 16, 13];
  }

  return [
    pointSizeParam ?? pointSize,
    textSizeCharParam ?? textSizeChar,
    textSizeCoordParam ?? textSizeCoord,
  ];
};

/**
 * Draw polygons from points coordinates and generate image file (path ../img/figure_[index]_[hh_mm_ss].[ext])
 *
 * @param {Array< {x:number,y:number}>} figuresRaw
 * @param { 'svg'|'png'|'jpg'|'jpeg'|'jpegLow' } [typeFileOutput='svg']
 * @param {number} [pointSize=3] (1-3 depends on points number)
 * @param {number} [textSizeChar=16] (8-16 depends on points number)
 * @param {number} [textSizeCoord=13] (0-13 depends on points number)
 *
 * @return { Array<{ figureIndex: number, canvas: nodeCanvas.Canvas }> }
 */
function drawPolygonOnCanvas(figuresRaw, typeFileOutput, pointSize, textSizeChar, textSizeCoord) {
  let figures = figuresRaw;
  if (!Array.isArray(figuresRaw[0])) {
    figures = [figuresRaw];
  }

  const finishedCanvasImages = [];

  for (let figureIndex = 0; figureIndex < figures.length; figureIndex++) {
    const points = figures[figureIndex].map(({ x, y }) => ({ x: toPrecision2(x), y: toPrecision2(y) }));

    if (points.length === 0) {
      console.log(`ERROR: Not found points in figureIndex - ${figureIndex}`);
      return finishedCanvasImages;
    }

    const { canvas, ctx, zoomedPoints, labels } = canvasInit(points, typeFileOutput);

    drawFigure(ctx, ...zoomedPoints);

    for (let index = 0; index < zoomedPoints.length; index++) {
      const point = zoomedPoints[index];
      const label = labels[index];

      const styles = getStyleDependsOnPointsNumber(
        getStyleDependsOnPointsNumber,
        pointSize,
        textSizeChar,
        textSizeCoord
      );

      drawPoint(ctx, point.x, point.y, label, 'black', ...styles);
    }

    finishedCanvasImages.push({ figureIndex, canvas });
  }

  return finishedCanvasImages;
}

export default drawPolygonOnCanvas;
