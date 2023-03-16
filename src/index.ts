import ignore from 'ignore';

const cleanFileList = (testFiles: string[]) => {
  return testFiles
    .map((testFile) => testFile.replace(/^\.\//, ''))
    .filter(Boolean);
};

const splitFileLines = (fileContent: string) =>
  fileContent
    .split(/[\r\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const cleanCodeownersLines = (codeownersLines: string[]) => {
  return codeownersLines
    .map((line) => {
      // Remove comments
      const commentIndex = line.indexOf('#');
      return commentIndex > -1 ? line.slice(0, commentIndex).trim() : line;
    })
    .filter(Boolean);
};

const isCodeownersMatch = (glob: string, path: string) => {
  // @ts-expect-error this expression is definitely callable. Perhaps an ESM issue leads to the type miss
  const ig = ignore();
  // Uses a gitignore-matching library because GitHub models codeowners after gitignore https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners#codeowners-syntax
  // libraries like minimatch have different globbing edgecases https://github.com/kaelzhang/node-ignore#why-another-ignore
  return ig.add([glob]).ignores(path);
};

const splitWhitespace = (s: string) => s.split(/[ |\t]+/);

// This is a very brute-force implementation, taking ~60 seconds for a repo
// with ~20k files and hundreds of CODEOWNERS lines.
// For a use-case of just wanting the files of one specific owner, it would
// be better to build a separate function that uses glob-gitignore
// to search for owned files rather than filtering down a list of all files
export const buildCodeownersMap = (
  codeownersContent: string,
  filesToFindOwnersContent: string
) => {
  const codeownersLines = cleanCodeownersLines(
    splitFileLines(codeownersContent)
  );
  // Last match wins with CODEOWNERS
  codeownersLines.reverse();

  const filesToFindOwners = cleanFileList(
    splitFileLines(filesToFindOwnersContent)
      .map((s) => s.trim())
      .filter(Boolean)
  );

  const ownersToFiles: Record<string, string[]> = {
    UNOWNED: [],
  };
  filesToFindOwners.forEach((fileToFindOwner) => {
    const matchingLine = codeownersLines.find((line) => {
      const glob = splitWhitespace(line)[0];
      return isCodeownersMatch(glob, fileToFindOwner);
    });

    if (matchingLine) {
      const owners = splitWhitespace(matchingLine).slice(1);
      if (owners.length === 0) {
        ownersToFiles['UNOWNED'].push(fileToFindOwner);
      }
      owners.forEach((owner) => {
        ownersToFiles[owner] = ownersToFiles[owner] || [];
        ownersToFiles[owner].push(fileToFindOwner);
      });
    } else {
      ownersToFiles['UNOWNED'].push(fileToFindOwner);
    }
  });

  return ownersToFiles;
};
