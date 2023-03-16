import { buildCodeownersMap } from '../index';

/** Full version has comment explaining the intended effect of different patterns https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners#example-of-a-codeowners-file */
const githubDocsExample = `
# This is a comment.

*.js    @js-owner #This is an inline comment.

*.go docs@example.com

*.txt @octo-org/octocats

/build/logs/ @doctocat


docs/*  docs@example.com
# Strangely the above format only matches files in the root /docs folder
# While the below matches any apps directory, even nested ones
apps/ @doctocat

/docs/ @doctocat

/scripts/ @doctocat @octocat
**/logs @octocat

/apps/ @octocat
/apps/github
`;

describe('buildCodeownersMap', () => {
  describe('Successful match', () => {
    test('Behaves according to GitHub official doc example', () => {
      const githubFiles = `
      ./.eslintrc.js
      ./main.js
      ./main.go
      ./deeply/nested/main.go
      ./example.txt

      ./builds/logs/1.txt

      ./docs/doc-site.js
      ./docs/nested/nested-doc.md

      ./apps/search.js
      ./apps/deeply/nested/index.js
      ./apps/github/github-cli.js

      ./scripts/shared.js

      ./deeply/nested/apps/my-nested-app.js
      ./deeply/nested/logs/log2.txt
      ./nested/docs/README.md
      ./nested/docs/nested-again/file.md
      `;
      expect(buildCodeownersMap(githubDocsExample, githubFiles)).toEqual({
        UNOWNED: [
          'apps/github/github-cli.js',
          'nested/docs/README.md',
          'nested/docs/nested-again/file.md',
        ],
        '@js-owner': ['.eslintrc.js', 'main.js'],
        'docs@example.com': ['main.go', 'deeply/nested/main.go'],
        '@octo-org/octocats': ['example.txt'],
        '@doctocat': [
          'docs/doc-site.js',
          'docs/nested/nested-doc.md',
          'scripts/shared.js',
          'deeply/nested/apps/my-nested-app.js',
        ],
        '@octocat': [
          'builds/logs/1.txt',
          'apps/search.js',
          'apps/deeply/nested/index.js',
          'scripts/shared.js',
          'deeply/nested/logs/log2.txt',
        ],
      });
    });
  });

  describe('Errors', () => {
    // TODO:
  });
});
