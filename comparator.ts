import { exec as _exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const exec = util.promisify(_exec);
const originalVideo = 'original.mkv';
const pathToVideos = process.argv[2];
const pathToOriginal = path.join(pathToVideos, originalVideo);

const compare = async (file: string) => {
  console.log('Compare video', file, 'with', originalVideo);
  const { stdout, stderr } = await exec(`./cpp/main ${pathToOriginal} ${file} 100 100`);
  stderr && console.error(`\n${stderr}`);
  if (stdout) {
    const report = file.replace(/mkv|mp4|webm/, 'csv');
    fs.writeFile(report, stdout, (err) => {
      if (err) console.error('File writing error:', err);
      else console.log('Report', report, 'successfully created');
    });
  }
};

const main = async () => {
  const { stdout, stderr } = await exec(`ls ${pathToVideos}`);
  if (stderr) console.error(stderr);

  const files = stdout.split('\n')
    .filter((x) => x && x !== originalVideo)
    .filter((name) => name.match(/^.+\.(mkv|mp4|webm)$/));

  // console.log(files)

  files.forEach((file) => compare(path.join(pathToVideos, file)));
};

main();
