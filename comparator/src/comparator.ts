import { exec as _exec } from 'child_process';
import util from 'util';

import { Request } from './types';

const exec = util.promisify(_exec);

export const compare = async (files: Request): Promise<string | null> => {
  const { stdout, stderr } = await exec(`./cpp/main ${files.original} ${files.copy} 100 100`);
  stderr && console.error(`\n${stderr}`);
  return stdout || null;
}
