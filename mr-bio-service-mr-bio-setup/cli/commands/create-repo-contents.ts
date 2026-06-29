/* eslint-disable no-console */
import path from 'node:path';
import * as readline from 'readline/promises';
import { executeCommand } from '../utils/command-line';
import { promptForRequiredValue } from '../utils/input';
import doesFileExist, { createTemplateBasedDirStructure } from '../utils/file';
import {
  capitalizeFirstLetterOfEachWord,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from '@mr-bio/core/shared';

export default async function createRepoContents() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const microserviceName = await promptForRequiredValue(rl, 'Name of the microservice:');
  const microserviceDirPath = path.join(process.cwd(), `apps/${toKebabCase(microserviceName)}`);

  if (!doesFileExist(microserviceDirPath)) {
    console.log('Failed to set up repo. Microservice does not exit.');
    process.exit();
  }

  const featureName = await rl.question('Name of the feature [empty for root feature]: ');
  if (featureName) {
    const featureDirPath = path.join(microserviceDirPath, `src/app/${toKebabCase(featureName)}`);
    if (!doesFileExist(featureDirPath)) {
      console.log('Failed to set up repo. Feature does not exit.');
      process.exit();
    }
  }

  const entityName = await promptForRequiredValue(rl, 'Name of the entity for the feature:');

  let featureDirPath = path.join(microserviceDirPath, 'src/app/');
  if (featureName) {
    featureDirPath = path.join(featureDirPath, `/${toKebabCase(featureName)}`);
  }
  const repoDirPath = path.join(featureDirPath, '/repository');

  const sampleDirPath = path.join(
    process.cwd(),
    'cli/templates/microservice/src/app/{{featureNameKebabCase}}/repository'
  );

  const variables = createVariables({
    entityName,
    featureName,
  });

  await createTemplateBasedDirStructure({
    variables,
    sampleDirPath,
    destinationDirPath: repoDirPath,
  });

  console.log('\n\nRepository contents set up successfully\n');
  console.log('Fixing lint...');
  await executeCommand('npm run lint:fix');

  process.exit(0);
}

function createVariables({ entityName, featureName }: { entityName: string; featureName: string }) {
  return {
    entityNameCamelCase: toCamelCase(entityName),
    entityNameKebabCase: toKebabCase(entityName),
    entityNamePascalCase: toPascalCase(entityName),
    entityName: capitalizeFirstLetterOfEachWord(entityName),
    entityNameSnakeCaseScreaming: toSnakeCase(entityName, true),
    featureRoot: featureName ? `app/${toKebabCase(featureName)}` : 'app',
  };
}
