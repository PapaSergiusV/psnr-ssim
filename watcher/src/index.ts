import chokidar from 'chokidar';
import { config } from 'dotenv';
import Path from 'path';
import { originalFileName } from './const';
import { FilesCollection } from './FilesCollection';
import { saveFilesMap } from './fs';
import { report } from './http';

config();

const folder = process.env.FOLDER;
const extensions = ['.mkv', '.webm'];
const store = new FilesCollection();

chokidar.watch(folder).on('add', (path) => {
  const fullPath = Path.join(__dirname, '..', path);
  if (extensions.includes(Path.extname(path)) && !store.has(fullPath)) {
    const isOriginal = Path.basename(fullPath) === originalFileName;
    if (isOriginal) {
      store.copies(fullPath).forEach((copy) => report(fullPath, copy));
    } else {
      const original = store.original(fullPath);
      if (original) report(original, fullPath);
    }
    store.add(fullPath);
  }
});

process.on('SIGINT', () => {
  saveFilesMap(store.files);
});
