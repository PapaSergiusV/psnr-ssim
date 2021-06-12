import axios from 'axios';
import { basename } from 'path';
import { config } from 'dotenv';

config();

const url = process.env.GATEWAY_URL;

const defineCodec = (path: string): string => {
  const name = basename(path);
  if (name.match(/^264.+$/)) return 'h264';
  if (name.match(/^265.+$/)) return 'h265';
  if (name.match(/^vp8.+$/)) return 'vp8';
  if (name.match(/^vp9.+$/)) return 'vp9';
  return '';
}

export const report = (original: string, copy: string) => {
  const codec = defineCodec(copy);
  const resolution = original.match(/1080/) ? 1080 : 720;
  if (!codec) return;

  axios.post(url, { original, copy, codec, resolution })
    .then((v) => console.log(`${v.status === 200 ? 'OK' : v.status}\t${copy}`))
    .catch((err) => console.log(err));
};
