import fs from 'fs';
import path from 'path';
import { FilesMap } from './types';

const filePath = 'filesMap.json';

export const loadFilesMap = (): FilesMap => {
  let collection: FilesMap;
  try {
    collection = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
  } catch (err) {
    collection = {};
  }
  return collection;
};

export const saveFilesMap = async (filesMap: FilesMap) => {
  await fs.writeFile(filePath, JSON.stringify(filesMap, null, 2), (err) => err && console.log(err));
};

export const getFiles = (dir: string): string[] => {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((x) => x.isFile() && x.name !== 'original.mkv' && x.name.match(/^.+\.(webm|mkv)$/))
    .map((file) => path.join(dir, file.name));
};
