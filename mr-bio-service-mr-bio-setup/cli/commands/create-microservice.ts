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

export default async function createService() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const microserviceName = await promptForRequiredValue(rl, 'Name of the microservice:');
  const featureName = await rl.question('Name of the initial feature [empty for root feature]: ');
  const entityName = await promptForRequiredValue(rl, 'Name of the entity for the feature:');
  const debuggerPort = await rl.question('Debbuger port: ');

  const microserviceDirPath = path.join(process.cwd(), `apps/${toKebabCase(microserviceName)}`);

  const sampleDirPath = path.join(process.cwd(), 'cli/templates/microservice');

  const variables = createVariables({ entityName, featureName, debuggerPort, microserviceName });

  if (doesFileExist(microserviceDirPath)) {
    console.log('Failed to create microservice. Microservice already exits.');
    process.exit();
  }

  await createTemplateBasedDirStructure({
    variables,
    sampleDirPath,
    destinationDirPath: microserviceDirPath,
  });

  console.log('Microservice set up successfully\n');

  console.log('Installing dependencies...');
  await executeCommand('npm i');

  console.log('Fixing lint...');
  await executeCommand('npm run lint:fix');

  process.exit(0);
}

function createVariables({
  entityName,
  featureName,
  debuggerPort,
  microserviceName,
}: {
  microserviceName: string;
  featureName: string;
  entityName: string;
  debuggerPort: string;
}) {
  return {
    debuggerPort,
    microserviceName,
    entityNameCamelCase: toCamelCase(entityName),
    entityNameKebabCase: toKebabCase(entityName),
    featureNameKebabCase: toKebabCase(featureName),
    entityNamePascalCase: toPascalCase(entityName),
    entityName: capitalizeFirstLetterOfEachWord(entityName),
    microserviceNameKebabCase: toKebabCase(microserviceName),
    microserviceNameCamelCase: toCamelCase(microserviceName),
    microserviceNamePascalCase: toPascalCase(microserviceName),
    entityNameKebabCaseScreaming: toKebabCase(entityName, true),
    entityNameSnakeCaseScreaming: toSnakeCase(entityName, true),
    featureRoot: featureName ? `app/${toKebabCase(featureName)}` : 'app',
  };
}
