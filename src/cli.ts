#!/usr/bin/env node
/* eslint-disable no-console */

import { chalkStderr } from 'chalk';
import { program } from 'commander';
import logSymbols from 'log-symbols';

program
  .arguments('<snippets.md> [generated-output.code-snippets]')
  .action(async function runCodeownersFilter(...args) {
    console.error(chalkStderr.red(`${logSymbols.error} Not yet implemented}`));
  });

if (process.argv.length === 2) {
  program.help();
} else {
  program.parseAsync(process.argv);
}
