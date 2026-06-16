import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type ChangedFile = {
  path: string;
  status: string;
};

export async function getChangedFiles(): Promise<ChangedFile[]> {
  const { stdout } = await execFileAsync('git', ['status', '--porcelain=v1']);
  return stdout
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const status = line.slice(0, 2).trim();
      const rawPath = line.slice(3).trim();
      const path = rawPath.includes(' -> ') ? rawPath.split(' -> ').at(-1) ?? rawPath : rawPath;
      return { path, status };
    });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(await getChangedFiles(), null, 2));
}
