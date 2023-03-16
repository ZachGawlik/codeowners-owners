# codeowners-owners

## Setup

```sh
npm install
npm link
```

## Usage

Requires passing a plain file listing the paths to find the owner for from cwd.
To analyze your whole repo, run

```sh
cd repo/to/analyze
fd --type f > all-unignored-files.txt
codeowners-owners all-unignored-files.txt
```

## Related projects

- [beaugunderson/codeowners](https://github.com/beaugunderson/codeowners) can be used to get the owner of a single file, as well as validate the file
- [mszostok/codeowners-validator](https://github.com/mszostok/codeowners-validator) Go implementation of codeowners file validation
- [andyfeller/gh-codeowner-analysis](https://github.com/andyfeller/gh-codeowner-analysis) is a `gh` CLI extension focused on codeowners permissions
