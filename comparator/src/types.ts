export type Request = {
  original: string;
  copy: string;
  codec: string;
};

export const isValidRequest = (data: any): data is Request => {
  return data?.original && data?.copy && typeof data.original === 'string' && typeof data.copy === 'string'
    && ['vp8', 'vp9', 'h264', 'h265'].includes(data.codec);
};

export type VideoMetrics = {
  kbps: number;
  psnr: number;
  psnr_max: number;
  psnr_min: number;
  ssim: number;
  ssim_max: number;
  ssim_min: number;
}

export type VideoInfo = {
  ip: string;
  path: string;
  kbps: number;
  codec: string;
  psnr: number;
  psnr_max: number;
  psnr_min: number;
  ssim: number;
  ssim_max: number;
  ssim_min: number;
};
