import { promises as fsp } from 'fs';
import path from 'path';
import { optimize as svgoOptimize } from 'svgo';

import { getDirname, nowTime } from './utils/utils.js';

/**
 * Save canvas image to image file
 *
 * @param { number } index
 * @param { Canvas } canvas
 * @param { 'svg'|'png'|'jpg'|'jpeg'|'jpegLow' } [typeFileOutput='svg']
 * @param { string } [filepath='./img/']
 *
 * @return { Promise<undefined> }
 */
const saveCanvasToFileImage = (index, canvas, typeFileOutput = 'svg', filepath) => {
  if (typeFileOutput === 'svg' && canvas.type !== 'svg') {
    throw new Error('Canvas was created with the type is NOT "SVG". But typeFileOutput - "SVG"');
  } else if (typeFileOutput !== 'svg' && canvas.type !== 'image') {
    throw new Error('Canvas was created with the type is NOT "image". But typeFileOutput - is not "SVG"');
  }

  const mapTypeToSettnigs = {
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
  mapTypeToSettnigs.jpg = mapTypeToSettnigs.jpeg;
  const typeSettings = mapTypeToSettnigs[typeFileOutput];

  let outputpath = filepath;
  if (filepath.endsWith('/')) {
    outputpath += `figure_${index}_${nowTime().replace(/:/g, '_')}.${typeSettings.ext}`;
  }
  const pathImg = path.resolve(getDirname(import.meta.url), '..', outputpath);
  console.log(pathImg);
  if (typeFileOutput === 'svg') {
    const svgString = canvas.toBuffer('image/svg+xml').toString('utf8');
    const optimizedSvgString = svgoOptimize(svgString, {}).data;

    return fsp.writeFile(pathImg, optimizedSvgString, 'utf-8');
  }

  return fsp.writeFile(pathImg, canvas.toBuffer(typeSettings.mime, typeSettings.settings));
};

export default saveCanvasToFileImage;
