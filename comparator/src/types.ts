export type Request = {
  original: string;
  copy: string;
  codec: string;
  resolution: number;
};

export const isValidRequest = (data: any): data is Request => {
  return data?.original && data?.copy && typeof data.original === 'string' && typeof data.copy === 'string'
    && ['vp8', 'vp9', 'h264', 'h265'].includes(data.codec) && typeof data.resolution === 'number';
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
  resolution: number;
  psnr: number;
  psnr_max: number;
  psnr_min: number;
  ssim: number;
  ssim_max: number;
  ssim_min: number;
};
