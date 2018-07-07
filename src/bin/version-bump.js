#!/usr/bin/env node

import program from 'commander'

const packageData = require('../../package.json')

program
  .version(packageData.version)
  .usage('<strategy> [options]')
  .option('--configFile [fileName]', `Name of the optional config file, relative to projectRoot.
                                    Default is ".version-pump.js".`)
  .option('--projectRoot [path]', `The project root where the version file is found.
                                    Default is process.cwd().`)
  .option('--versionFile [fileName]', `The relative path to the JSON version file from projectRoot
                                    that contains the "version" property.
                                    Default is "package.json".`)
  .option('--bumpStrategy [strategy|fileName]', `The name of the bump strategy to use or the
                                    path to one from projectRoot.
                                    Default is "git-commit-msg".`)
  .option('--strategyOptions', `Strategy-specific options.`)

