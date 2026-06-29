#!/usr/bin/env node
import { Command } from 'commander';
import createFeature from './commands/create-feature';
import createService from './commands/create-microservice';
import createRepoContents from './commands/create-repo-contents';

const program = new Command();

program.version('1.0.0');
program
  .command('create-microservice')
  .description('Create a new micro service')
  .action(createService);
program
  .command('create-feature')
  .description('Create a new feature for a microservice')
  .action(createFeature);
program
  .command('create-repo-contents')
  .description('Create a new data model contents in a repository')
  .action(createRepoContents);

program.parse(process.argv);
