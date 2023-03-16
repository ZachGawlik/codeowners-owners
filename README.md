# codeowners-owners

## Setup

```sh
npm install
npm run build
chmod +x lib/cli.js
npm link
```

## Usage

You must run the CLI tool from the root of a github repo (for now).
That repo must have codeowners specified at `./CODEOWNERS` from the repo root.
From that directory, you pass in a path for a file that lists all the repo filepaths you want to find owners for, relative to repo root.
To analyze your whole repo, use [fd](https://github.com/sharkdp/fd) to run the following:

```sh
cd repo/to/analyze
fd --type f > all-unignored-files.txt
codeowners-owners all-unignored-files.txt
```

The command outputs a JSON object mapping `@codeowner1: ['path/to/ownedFile1', 'path/to/ownedFile2']`.
It also includes a key 'UNOWNED' listing all passed in files that don't match to any codeowner.

To save this to a file, tack on a `> codeowners-map.json` at the end of that final command.
To operate upon it via CLI tools, pipe (`|`) it into the tool of your choice like [jq](https://github.com/stedolan/jq), [fx](https://github.com/antonmedv/fx), or [jid](https://github.com/simeji/jid)

## Related projects

From what I can tell, no existing tool provides a way to assemble a complete listing of owners to files.

- [beaugunderson/codeowners](https://github.com/beaugunderson/codeowners) can be used to get the owner of a single file, as well as validate the file
- [mszostok/codeowners-validator](https://github.com/mszostok/codeowners-validator) Go implementation of codeowners file validation
- [andyfeller/gh-codeowner-analysis](https://github.com/andyfeller/gh-codeowner-analysis) is a `gh` CLI extension focused on codeowners permissions
