#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs/promises';
import { UserInputError } from './errors.js';
import { buildCodeownersMap } from './index.js';

const main = async () => {
  const fileOfFiles = process.argv[2];
  if (!fileOfFiles) {
    throw new UserInputError('Must supply fileOfFiles as an arg');
  }
  const [codeownersContent, filesToFindOwnersContent] = await Promise.all([
    fs.readFile('CODEOWNERS', 'utf-8'),
    fs.readFile(fileOfFiles, 'utf-8'),
  ]);

  const codeownersMap = buildCodeownersMap(
    codeownersContent,
    filesToFindOwnersContent
  );
  console.log(JSON.stringify(codeownersMap, null, 2));
};

main();
