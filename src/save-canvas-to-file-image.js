import { promises as fsp } from 'fs';
import path from 'path';
import { optimize as svgoOptimize } from 'svgo';
// eslint-disable-next-line no-unused-vars
import nodeCanvas from 'canvas';

import { getDirname, nowTime } from './utils/utils.js';

/**
 * Save canvas image to image file
 *
 * @param { nodeCanvas.Canvas } canvas
 * @param { number } index
 * @param { 'svg'|'png'|'jpg'|'jpeg'|'jpegLow' } [typeFileOutput='svg']
 * @param { string } [filepath='./img/']
 *
 * @return { Promise<undefined> }
 */
const saveCanvasToFileImage = (canvas, index = 0, typeFileOutput = 'svg', filepath = './img/') => {
  if (typeFileOutput === 'svg' && canvas.type !== 'svg') {
    throw new Error('Canvas was created with the type is NOT "SVG". But typeFileOutput - "SVG"');
  } else if (typeFileOutput !== 'svg' && canvas.type !== 'image') {
    throw new Error('Canvas was created with the type is NOT "image". But typeFileOutput - is not "SVG"');
  }

  const mapTypeToSettings = {
    svg: { ext: 'svg', mime: 'image/svg+xml', settings: {} },
    png: { ext: 'png', mime: 'image/png', settings: { compressionLevel: 2 } },
    jpeg: {
      ext: 'jpeg',
      mime: 'image/jpeg',
      settings: { quality: 0.96, progressive: true, chromaSubsampling: true },
    },
    jpegLow: {
      ext: 'jpeg',
      mime: 'image/jpeg',
      settings: { quality: 0.7, progressive: true, chromaSubsampling: true },
    },
  };

  mapTypeToSettings.jpg = mapTypeToSettings.jpeg;
  const typeSettings = mapTypeToSettings[typeFileOutput];

  let outputPath = filepath;
  if (!path.extname(filepath)) {
    outputPath += `figure_${index}_${nowTime().replace(/:/g, '_')}.${typeSettings.ext}`;
  }

  const moduleDir = path.resolve(getDirname(import.meta.url), '..');
  const pathImg = path.resolve(moduleDir, outputPath);
  console.log(pathImg);

  if (typeFileOutput === 'svg') {
    const svgString = canvas.toBuffer('image/svg+xml').toString('utf8');
    const optimizedSvgString = svgoOptimize(svgString, {}).data;

    return fsp.writeFile(pathImg, optimizedSvgString, 'utf-8');
  }

  return fsp.writeFile(pathImg, canvas.toBuffer(typeSettings.mime, typeSettings.settings));
};

export default saveCanvasToFileImage;
