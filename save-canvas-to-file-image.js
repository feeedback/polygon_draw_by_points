import { promises as fsp } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { optimize as svgoOptimize } from 'svgo';

const nowTime = (now = new Date()) => now.toLocaleTimeString('ru-Ru');
const getDirname = (url) => path.dirname(fileURLToPath(url)); // import.meta.url

const saveCanvasToFileImage = (index, canvas, typeFileOutput = 'svg') => {
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
  const typeSettings = mapTypeToSettnigs[typeFileOutput];

  const pathImg = path.resolve(
    getDirname(import.meta.url),
    `./img/figure_${index}_${nowTime().replace(/:/g, '_')}.${typeSettings.ext}`
  );

  if (typeFileOutput === 'svg') {
    const svgString = canvas.toBuffer('image/svg+xml').toString('utf8');
    const optimizedSvgString = svgoOptimize(svgString, {}).data;

    return fsp.writeFile(pathImg, optimizedSvgString, 'utf-8');
  }

  return fsp.writeFile(pathImg, canvas.toBuffer(typeSettings.mime, typeSettings.settings));
};
export default saveCanvasToFileImage;
