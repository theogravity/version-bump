# version-bump

[![npm version](https://badge.fury.io/js/%40theo.gravity%2Fversion-bump.svg)](https://badge.fury.io/js/%40theo.gravity%2Fversion-bump) [![CircleCI](https://circleci.com/gh/theogravity/changelog-version.svg?style=svg)](https://circleci.com/gh/theogravity/changelog-version)

Version bump package.json (or a file with a `version` property) via various version bump plugins/strategies.

## What it offers

- Can update `package.json` or any file with a `version` property using semver rules.
- Use a custom config file with additional callback handlers.
- Plugin-based architecture - develop your own version bump strategies and offer it for use on the command line or
as part of the API
- Built-in CLI bump strategy works like `npm version` (`git` support is a separate plugin)

## Contents

<!-- TOC -->
- [Bump rules](#bump-rules)
- [Install](#install)
- [Quick start usage](#quick-start-usage)
- [CLI Usage](#cli-usage)
  - [Get help on a version strategy](#get-help-on-a-version-strategy)
- [Custom configuration file](#custom-configuration-file)
  - [Additional properties](#additional-properties)
    - [`async onBeforeRelease(versionData)` : versionData](#async-onbeforereleaseversiondata--versiondata)
- [Installing other strategies (plugins)](#installing-other-strategies-plugins)
  - [Available strategies (plugins)](#available-strategies-plugins)

<!-- TOC END -->

## Bump rules

These rules are *not* designed to work like the npm package `semver` or `npm version`.

- horizontal: Sample version
- vertical: bump level used
- value: new bumped version

|               | 1.0.0   | 2.1.0   | 3.2.1   | 4.0.0-0   | 5.0.0+0 | 6.0.0-pre.0   | 7.0.0+build.0 | 8.0.0-pre.0+build.0 |
|---------------|---------|---------|---------|-----------|---------|---------------|---------------|---------------------|
| major         | 2.0.0   | 3.0.0   | 4.0.0   | 4.0.0     | 6.0.0   | 6.0.0         | 8.0.0         | 8.0.0               |
| minor         | 1.1.0   | 2.2.0   | 3.3.0   | 4.0.0     | 5.1.0   | 6.0.0         | 7.1.0         | 8.0.0               |
| patch         | 1.0.1   | 2.1.1   | 3.2.2   | 4.0.0     | 5.0.1   | 6.0.0         | 7.0.1         | 8.0.0               |
| pre-major     | 2.0.0-0 | 3.0.0-0 | 4.0.0-0 | 5.0.0-0   | 6.0.0-0 | 7.0.0-0       | 8.0.0-0       | 9.0.0-0             |
| pre-minor     | 1.1.0-0 | 2.2.0-0 | 3.3.0-0 | 4.1.0-0   | 5.1.0-0 | 6.1.0-0       | 7.1.0-0       | 8.1.0-0             |
| pre-patch     | 1.0.1-0 | 2.1.1-0 | 3.2.2-0 | 4.0.1-0   | 5.0.1-0 | 6.0.1-0       | 7.0.1-0       | 8.0.1-0             |
| pre-release   | 1.0.1-0 | 2.1.1-0 | 3.2.2-0 | 4.0.0-1   | 5.0.1-0 | 6.0.0-pre.1   | 7.0.1-0       | 8.0.0-pre.1         |
| build-release | 1.0.0+0 | 2.1.0+0 | 3.2.1+0 | 4.0.0-0+0 | 5.0.0+1 | 6.0.0-pre.0+0 | 7.0.0+build.1 | 8.0.0-pre.0+build.1 |

- If a `pre` level exists and you are bumping `major` / `minor` / `patch`, the `pre` level is
removed and the rest of the version is unchanged
- `build` levels are removed when any other version level is used other than `build`

## Install

`npm install -g @theo.gravity/version-bump`

## Quick start usage

This package comes with the `cli` version bump strategy included. You can use it via:

`version-bump cli --bump <type>`

Where `<type>` is one of the following:

* `major`
* `minor`
* `patch`
* `pre-major`
* `pre-minor`
* `pre-patch`
* `pre-release`
* `pre-*:<colon-sep-tags> (pre-release:alpha:rc)`
* `build-release`
* `build-release:<colon-sep-tags> (build-release:qa)`

Default is patch level, unless pre/build exists.

If pre/build exists:

- Build is bumped if it exists.
- Pre is bumped if build does not exist, but pre does.

## CLI Usage

To use `version-bump`, a strategy must be selected. You can see a list of options and strategies by
calling `version-bump` without any options.

```
$ version-bump

Commands:
  version-bump cli [bump]  Performs a version bump based on the --bump flag

Options:
  --version      Show version number                                                                           [boolean]
  --projectRoot  The project root where the version file is found. Default is process.cwd()
                                                                   [default: "/Users/t.gravity/sixfive-cs/version-bump"]
  --configFile   Name of the optional config file, relative to projectRoot.                [default: ".version-bump.js"]
  --versionFile  The relative path to the JSON version file from projectRoot that contains the "version" property.
                                                                                               [default: "package.json"]
  --help         Show help                                                                                     [boolean]
```

### Get help on a version strategy

```
$ version-bump cli --help

Performs a version bump based on the --bump flag

Positionals:
  bump  Version type to bump.

        Values can be:
        * major
        * minor
        * patch
        * pre-major
        * pre-minor
        * pre-patch
        * pre-release
        * pre-*:<colon-sep-tags> (pre-release:alpha:rc)
        * build-release
        * build-release:<colon-sep-tags> (build-release:qa)

        Default is the lowest version possible.

Options:
  --version      Show version number                                                                           [boolean]
  --projectRoot  The project root where the version file is found. Default is process.cwd()
                                                                   [default: "/Users/t.gravity/sixfive-cs/version-bump"]
  --configFile   Name of the optional config file, relative to projectRoot.                [default: ".version-bump.js"]
  --versionFile  The relative path to the JSON version file from projectRoot that contains the "version" property.
                                                                                               [default: "package.json"]
  --help         Show help                                                                                     [boolean]
```

## Custom configuration file

To spare yourself from having to specify command line options each time, you can use a custom config file.

Place `.version-bump.js` in the root of your project.

(The file name can be configured with the `--configFile` option, which is relative to `--projectRoot`.)

If detected, `version-bump` will derive options from this file.

With the exception of `projectRoot`, options defined on the command line will take
precedence.

```js
// This is an optional configuration file
// you can use with version-bump.
// If specified, any command line args has priority over the
// values returned in this file.

// All values are optional.
// Do not use the ES6 export default
// since the file is imported using require()
// See command line options for additional available properties
module.exports = {
  // (required) Name of the strategy as found in the strategy list in the CLI
  strategy: 'cli',

  // (optional) Root of the project where the version file is found
  // default is process.cwd()
  projectRoot: () => {
    return process.cwd()
  },

  /**
   * (optional)
   * This is called after the version has been incremented
   * and before the version data is to be converted to a string and saved
   * to the version file
   * Use the opportunity to do any custom-work to the version data
   * eg add a pre-release string, or build string
   * @param {object} versionData
   * @param {number} versionData.major
   * @param {number} versionData.minor
   * @param {number} versionData.patch
   * @param {array|undefined} versionData.pre Ex: ['alpha', 1] becomes x.x.x-alpha.1
   * @param {array|undefined} versionData.build Ex: ['qa', 1234] becomes x.x.x+qa.1234
   * @returns {object}
   */
  onBeforeRelease: (versionData) => {
    versionData.pre = ['alpha', 1]
    return versionData
  },

  // (optional) Version file starting from projectRoot
  // default is package.json
  versionFile: 'myVersionFile.json',

  // Options specific to the strategy you are using
  // root properties can be set to straight values, or (async) functions that return a value
  // this corresponds to the --bump option
  bump: () => {
    return 'minor'
  }
}
```

With the options above, if `myVersionFile.json` contained the following:

```
{
  version: '1.2.3'
}
```

The above configuration does the following:

- use the strategy `cli`
- the `bump` parameter of the `cli` strategy is set to `minor`, so the minor version will bump
- after the strategy bumps minor, `alpha.1` is added to the version stamp due to the `onBeforeRelease` callback

This results in:

```
{
  version: '1.3.0-alpha.1'
}
```

### Additional properties

Aside from the command line options, the config file offers additional properties:

#### `async onBeforeRelease(versionData)` : versionData

This is called after the version has been incremented, but before the final write of the version to the file.

You must return the original or updated `versionData`.

## Installing other strategies (plugins)

You can find other strategies by searching for
[`version-bump-plugin`](https://www.npmjs.com/search?q=version-bump-plugin) on npm.

All strategies should contain `version-bump-plugin` in the package name

Once you've found the strategy you want, you simply add it by installing it to your node modules directory.

`npm install version-bump-plugin-git`

You should be able to see the list of strategies by doing

`version-bump`

In the command line.

### Available strategies (plugins)

* [version-bump-plugin-git](https://github.com/theogravity/version-bump-plugin-git) - Bumps version
based on last git commit message
