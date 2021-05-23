export type Statistic = {
  bitrate: number;
  psnr: number;
  ssim: {
    r: number;
    g: number;
    b: number;
  };
}
