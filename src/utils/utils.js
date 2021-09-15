import { randomInt } from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';

export const toPrecision2 = (num) => Math.floor(num * 10) / 10;

export const nowTime = (now = new Date()) => now.toLocaleTimeString('ru-Ru');

export const getDirname = (url) => path.dirname(fileURLToPath(url)); // import.meta.url

export const createFigure = (pointCount, minX = 0, maxX = 40, minY = 0, maxY = 20) =>
  new Array(pointCount).fill(null).map(() => ({ x: randomInt(minX, maxX), y: randomInt(minY, maxY) }));

export const createIncreasedFigure = (pointCount, scaleFactor = 10) =>
  new Array(pointCount)
    .fill(null)
    .map((_, i) => ({ x: randomInt(i, scaleFactor * (i + 1)), y: randomInt(i, scaleFactor * (i + 1)) }));

export const getDist = (a, b) => Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);

export const getMinXYFromPoints = (points) => ({
  min: {
    x: Math.min(...points.map(({ x, y }) => x)),
    y: Math.min(...points.map(({ x, y }) => y)),
  },
  max: {
    x: Math.max(...points.map(({ x, y }) => x)),
    y: Math.max(...points.map(({ x, y }) => y)),
  },
});
