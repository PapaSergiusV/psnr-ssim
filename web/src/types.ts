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

export type WebRequest = {
  msgId: number;
  codecs?: string[];
  videos?: string[];
}

export type WebResponse = {
  msgId: number;
  videos: VideoInfo[];
}
