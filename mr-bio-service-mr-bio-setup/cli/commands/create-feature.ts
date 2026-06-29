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

export default async function createFeature() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const microserviceName = await promptForRequiredValue(rl, 'Name of the microservice:');
  const featureName = await promptForRequiredValue(rl, 'Name of the feature:');
  const entityName =
    (await rl.question('Name of the entity for the feature [empty to use feature name]: ')) ||
    featureName;

  const microserviceDirPath = path.join(process.cwd(), `apps/${toKebabCase(microserviceName)}`);
  const featureDirPath = path.join(
    process.cwd(),
    `apps/${toKebabCase(microserviceName)}/src/app/${toKebabCase(featureName)}`
  );

  const sampleDirPath = path.join(
    process.cwd(),
    'cli/templates/microservice/src/app/{{featureNameKebabCase}}'
  );

  const variables = createVariables({
    entityName,
    featureName,
  });

  if (!doesFileExist(microserviceDirPath)) {
    console.log('Failed to create feature. Microservice does not exit.');
    process.exit();
  }

  if (doesFileExist(featureDirPath)) {
    console.log('Failed to create feature. Feature already exits.');
    process.exit();
  }

  await createTemplateBasedDirStructure({
    variables,
    sampleDirPath,
    destinationDirPath: featureDirPath,
  });

  console.log('Feature set up successfully\n');
  console.log('Fixing lint...');
  await executeCommand('npm run lint:fix');

  process.exit(0);
}

function createVariables({ entityName, featureName }: { featureName: string; entityName: string }) {
  return {
    entityNameCamelCase: toCamelCase(entityName),
    entityNameKebabCase: toKebabCase(entityName),
    featureNameKebabCase: toKebabCase(featureName),
    featureRoot: `app/${toKebabCase(featureName)}`,
    entityNamePascalCase: toPascalCase(entityName),
    entityName: capitalizeFirstLetterOfEachWord(entityName),
    entityNameKebabCaseScreaming: toKebabCase(entityName, true),
    entityNameSnakeCaseScreaming: toSnakeCase(entityName, true),
  };
}
