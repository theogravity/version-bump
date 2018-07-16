TODO: Figure out how the strategy will be loaded from config file

# version-bump

Version bump package.json (or a file with a `version` property) via various version bump plugins/strategies.

## What it offers

- Can update `package.json` or any file with a `version` property using semver rules.
- Use a custom config file with additional callback handlers.
- Plugin-based architecture - develop your own version bump strategies and offer it for use on the command line or
as part of the API
- Built-in CLI bump strategy works like `npm version` (`git` support is a separate plugin)

## Contents

<!-- TOC -->
<!-- TOC END -->

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

  Usage:  [options] <strategy>

  Options:

    -V, --version             output the version number
    --configFile [fileName]   Name of the optional config file, relative to projectRoot.
                                        Default is ".version-pump.js".
    --projectRoot [path]      The project root where the version file is found.
                                        Default is process.cwd().
    --versionFile [fileName]  The relative path to the JSON version file from projectRoot
                                        that contains the "version" property.
                                        Default is "package.json".
    -h, --help                output usage information

  Strategies: (use version-bump <strategy> --help for more info)

    cli [options]             Performs a version bump based on command line options.
```

### Get help on a version strategy

```
$ version-bump cli --help

  Usage: cli [options]

  Performs a version bump based on command line options.

  Options:

    --bump <bumpType>  Bump the version based on <bumpType>.
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
    -h, --help         output usage information
```

## Custom configuration file

To spare yourself from having to specify command line options each time, you can use a custom config file.

Place `.changelog.js` in the root of your project.

(The file name can be configured with the `--configFile` option, which is relative to `--projectRoot`.)

If detected, `changelog-version` will derive options from this file.

With the exception of `projectRoot`, options defined on the command line will take
precedence.

```js
// This is an optional configuration file
// you can use with changelog-version.
// If specified, any command line args has priority over the
// values returned in this file.

// All values are optional.
// Do not use the ES6 export default
// since the file is imported using require()
// See command line options for additional available properties
module.exports = {
  projectRoot: () => {
    return process.cwd()
  },
  /**
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

  versionFile: 'myVersionFile.json',
  // Name of the strategy as found in the strategy list in the CLI
  strategy: 'cli',
  // Options specific to the strategy you are using
  strategyOptions: async () => {
    return {
      bump: 'minor'
    }
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

#### `async onBeforeRelease(versionData)`

This is called after the version has been incremented, but before the final write of the version to the file.

## Installing other strategies

You can find other strategies by searching for
[`version-bump-plugin`](https://www.npmjs.com/search?q=version-bump-plugin) on npm.

Once you've found the strategy you want, you simply add it by installing it to your node modules directory.

`npm install version-bump-plugin-git`

You should be able to see the list of strategies by doing

`version-bump`

In the command line.

### Available strategies

* [version-bump-plugin-git]()
