import { readdirSync, writeFile } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { Statistic } from './types';

const dirPath = process.argv[2] || '../videos/';

const averageStatistic = (data: Statistic[]): Statistic => {
  const { bitrate } = data[0];
  const psnr = data.reduce((sum, x) => {
    if (x.psnr) return sum += x.psnr;
    return sum;
  }, 0) / data.length;
  let { r, g, b } = data.reduce((sum, x) => {
    if (x.ssim.r && x.ssim.g && x.ssim.b) {
      sum.r += x.ssim.r;
      sum.g += x.ssim.g;
      sum.b += x.ssim.b;
    }
    return sum;
  }, { r: 0, g: 0, b: 0 });
  r /= data.length;
  g /= data.length;
  b /= data.length;
  return { bitrate, psnr, ssim: { r, g, b } };
};

const parseLine = (line: string): Statistic => {
  const [ _, bitrate, psnr, r, g, b ] = line.split(';').map(x => +x);
  return {
    bitrate,
    psnr,
    ssim: { r, g, b },
  }
};

const parseFile = (data: string): Statistic[] => {
  return data.split('\n').map((line) => parseLine(line));
};

const getDirectories = (directory: string): string[] => {
  const dirs = readdirSync(directory, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => path.join(directory, dir.name));
  dirs.forEach((dir) => {
    getDirectories(dir).forEach((d) => dirs.push(d));
  });
  return dirs;
}

const allDirs = getDirectories(dirPath);
const files = allDirs.map((dir) => {
  return readdirSync(dir, { withFileTypes: true })
    .filter((x) => x.isFile() && x.name.match(/^.+\.csv$/))
    .map((file) => path.join(dir, file.name));
})
  .reduce((acc, x) => acc.concat(x), []);

const promises = files.map((file) => readFile(file, 'utf-8'));

const data: Record<string, Statistic[]> = {
  vp8_720: [],
  vp9_720: [],
  h264_720: [],
  h265_720: [],
  vp8_1080: [],
  vp9_1080: [],
  h264_1080: [],
  h265_1080: [],
};

const regex: Record<string, RegExp> = {
  vp8_720: /720\/vp8.+/,
  vp9_720: /720\/vp9.+/,
  h264_720: /720\/264.+/,
  h265_720: /720\/265.+/,
  vp8_1080: /1080\/vp8.+/,
  vp9_1080: /1080\/vp9.+/,
  h264_1080: /1080\/264.+/,
  h265_1080: /1080\/265.+/,
};

const avgs: Record<string, { psnr: number, ssim: number }> = {
  vp8_720: { psnr: 0, ssim: 0 },
  vp9_720: { psnr: 0, ssim: 0 },
  h264_720: { psnr: 0, ssim: 0 },
  h265_720: { psnr: 0, ssim: 0 },
  vp8_1080: { psnr: 0, ssim: 0 },
  vp9_1080: { psnr: 0, ssim: 0 },
  h264_1080: { psnr: 0, ssim: 0 },
  h265_1080: { psnr: 0, ssim: 0 },
};

const defineKey = (file: string): string => {
  for (let key in regex) {
    if (file.match(regex[key])) return key;
  }
  return '';
};

const replaceDot = (num: number): string => {
  return String(num).replace('.', ',');
};

Promise.all(promises)
  .then((values) => {
    files.forEach((file, i) => {
      const stat = averageStatistic(parseFile(values[i]));
      const key = defineKey(file);
      data[key].push(stat);
    });
    for (let key in data) {
      data[key] = data[key].sort((a, b) => a.bitrate - b.bitrate);
    }
    // console.log(JSON.stringify(data, null, 2));
    for (let key in data) {
      writeFile(`${key}.csv`, data[key].map((s) => `${s.bitrate};`).join('') + '\n' + data[key].map(s => `${Math.round(s.psnr * 100)};`).join('') + '\n', (err) => err && console.error(err));
    }
    for (let key in avgs) {
      avgs[key].psnr = data[key].reduce((sum, x) => sum += x.psnr, 0) / data[key].length;
      avgs[key].ssim = data[key].reduce((sum, x) => sum += (x.ssim.r + x.ssim.g + x.ssim.b) / 3, 0) / data[key].length;
    }
    console.log(avgs)
  });
