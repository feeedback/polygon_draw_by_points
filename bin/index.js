#!/usr/bin/env node

import commander from 'commander';
import drawPolygonAndSaveToFile from '../src/index.js';

const handler = async (inputStr, options) => {
  const polygons = inputStr.trim().split(' ; ');

  const parsedPoints = polygons.map((polygon) =>
    polygon
      .trim()
      .split(' ')
      .map((point) => {
        const [x, y] = point.split(',').map(Number);

        return { x, y };
      })
  );

  await drawPolygonAndSaveToFile(parsedPoints, options.format, options.output);
};

const program = new commander.Command();

program
  .version('0.0.4')
  .description('Draw polygons from points coordinates and generate image file')
  .arguments('<points>')
  .option('-f, --format <image ext>', 'output image file type', 'svg')
  .option('-o, --output <filepath>', 'output image file path', './img/')
  .action(handler)
  .parse();
