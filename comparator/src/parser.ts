import { VideoMetrics } from './types';

type FrameInfo = {
  psnr: number;
  kbps: number;
  r: number;
  g: number;
  b: number;
};

const parseLine = (line: string): FrameInfo => {
  const [_, kbps, psnr, r, g, b] = line.split(';').filter((x) => x).map((x) => +x);
  return { kbps, psnr, r, g, b };
};

export const parseStdout = (stdout: string): VideoMetrics => {
  const sum = {
    psnr: 0,
    psnr_min: Number.MAX_VALUE,
    psnr_max: Number.MIN_VALUE,
    ssim: 0,
    ssim_min: Number.MAX_VALUE,
    ssim_max: Number.MIN_VALUE,
  };

  let frameInfo: FrameInfo;
  const lines = stdout.split('\n').filter((x) => x);
  lines.forEach((line) => {
    frameInfo = parseLine(line);
    const ssim = (frameInfo.r + frameInfo.g + frameInfo.b) / 3;
    sum.psnr += frameInfo.psnr;
    sum.ssim += ssim;
    if (sum.psnr_max < frameInfo.psnr) sum.psnr_max = frameInfo.psnr;
    if (sum.psnr_min > frameInfo.psnr) sum.psnr_min = frameInfo.psnr;
    if (sum.ssim_max < ssim) sum.ssim_max = ssim;
    if (sum.ssim_min > ssim) sum.ssim_min = ssim;
  });

  sum.psnr /= lines.length;
  sum.ssim /= lines.length;

  return {
    ...sum,
    kbps: frameInfo.kbps,
  };
};
