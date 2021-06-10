import chokidar from 'chokidar';
import { config } from 'dotenv';
import Path from 'path';
import { originalFileName } from './const';
import { FilesCollection } from './FilesCollection';
import { saveFilesMap } from './fs';

config();

const folder = process.env.FOLDER;
const extensions = ['.mkv', '.webm'];
const store = new FilesCollection();

const send = (original: string, copy: string) => {
  console.log(original, '- vs -', copy);
};

chokidar.watch(folder).on('add', (path) => {
  const fullPath = Path.join(__dirname, '..', path);
  if (extensions.includes(Path.extname(path)) && !store.has(fullPath)) {
    const isOriginal = Path.basename(fullPath) === originalFileName;
    if (isOriginal) {
      store.copies(fullPath).forEach((copy) => send(fullPath, copy));
    } else {
      const original = store.original(fullPath);
      if (original) send(original, fullPath);
    }
    store.add(fullPath);
  }
});

process.on('SIGINT', () => {
  saveFilesMap(store.files);
});
