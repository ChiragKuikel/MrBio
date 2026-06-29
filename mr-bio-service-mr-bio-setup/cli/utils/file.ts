/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'node:path';
import { rm, mkdir } from 'fs/promises';
import { replaceDynamicVariables } from './string';
import { existsSync, readdirSync, statSync } from 'fs';

export default function doesFileExist(path: string) {
  const exist = existsSync(path);

  return !!exist;
}

export async function removeDirectory(location: string, options?: any) {
  const exist = doesFileExist(location);
  if (!exist) return;

  return rm(location, options);
}

export function getDirectoryContents(directoryPath: string): string[] {
  try {
    return readdirSync(directoryPath);
  } catch (error) {
    console.error(`Error reading directory: ${error}`);

    return [];
  }
}

export function isDirectory(path: string): boolean {
  return statSync(path).isDirectory();
}

export async function createTemplateBasedDirStructure({
  variables,
  sampleDirPath,
  destinationDirPath,
}: {
  variables: Record<string, string>;
  sampleDirPath: string;
  destinationDirPath: string;
}) {
  await mkdir(destinationDirPath, { recursive: true });
  console.log(`\nCreated folder: ${destinationDirPath}`);

  const sampleContents = getDirectoryContents(sampleDirPath);
  for (const sampleContentName of sampleContents) {
    const sampleContentPath = path.join(sampleDirPath, sampleContentName);
    const contentName = replaceDynamicVariables(sampleContentName, variables).replace('.txt', '');
    const contentPath = path.join(destinationDirPath, contentName);

    if (isDirectory(sampleContentPath)) {
      await createTemplateBasedDirStructure({
        variables,
        destinationDirPath: contentPath,
        sampleDirPath: sampleContentPath,
      });
    } else {
      console.log('Creating File:', contentName);
      let fileContent: string = (await fs.readFile(sampleContentPath)).toString();
      fileContent = replaceDynamicVariables(fileContent, variables);
      await fs.writeFile(contentPath, fileContent);
    }
  }
}
