import { dirname, basename, join } from 'path';
import { FilesMap } from './types';
import { loadFilesMap } from './fs';
import { originalFileName } from './const';

export class FilesCollection {
  public files: FilesMap;

  constructor() {
    this.files = loadFilesMap();
  }

  public original(fullFilePath: string): string {
    const dir = dirname(fullFilePath);
    if (this.files[dir]?.includes(originalFileName)) return join(dir, originalFileName);
    return '';
  }

  public has(fullFilePath: string): boolean {
    const dir = dirname(fullFilePath);
    const file = basename(fullFilePath);
    return this.files[dir]?.includes(file);
  }

  public add(fullFilePath: string) {
    const dir = dirname(fullFilePath);
    const file = basename(fullFilePath);
    const { files } = this;
    if (!files[dir]) files[dir] = [];
    if (!files[dir].includes(file)) files[dir].push(file);
  }

  public copies(originalFilePath: string): string[] {
    const dir = dirname(originalFilePath);
    return this.files[dir]?.filter((name) => name !== originalFileName).map((name) => join(dir, name)) || [];
  }
}
