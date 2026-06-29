/* eslint-disable no-console */
import util from 'node:util';
import { exec } from 'node:child_process';
const execPromisified = util.promisify(exec);

export async function executeCommand(command: string) {
  const { stdout, stderr } = await execPromisified(command);
  console.log('STDOUT:', stdout, ', STDERR:', stderr);
}
