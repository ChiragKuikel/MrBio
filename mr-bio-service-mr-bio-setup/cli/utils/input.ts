import * as readline from 'readline/promises';

export async function promptForRequiredValue(
  rl: readline.Interface,
  question: string
): Promise<string> {
  let value: string | undefined;
  while (value === undefined || value === '') {
    value = await rl.question(`${question} [required]: `);
  }

  return value;
}
