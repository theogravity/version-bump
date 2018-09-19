#!/usr/bin/env node

import yargs from 'yargs'

import StrategyLoader from '../StrategyLoader'
import VersionBump from '../VersionBump'
import ConfigParser from '../ConfigParser'

const loader = new StrategyLoader()
const packageData = require('../../package.json')

let options = {}

async function execCli () {
  // eslint-disable-next-line no-unused-expressions
  let cli = yargs
    .version(packageData.version)
    .usage('version-bump <strategy>')
    .wrap(120)
    .options({
      projectRoot: {
        describe:
          'The project root where the version file is found. Default is process.cwd()'
      },
      configFile: {
        describe: 'Name of the optional config file, relative to projectRoot.'
      },
      versionFile: {
        describe:
          'The relative path to the JSON version file from projectRoot ' +
          'that contains the "version" property.'
      }
    })
  // This loads the strategies and allows yargs to list them in the commands listing
  await initStrategyCli(cli)

  // User did not explicity define a command to use
  // check if a config file exists and use that if it does
  const useConfigFile = cli.argv._.length === 0

  const parser = new ConfigParser(cli.argv, { logger: console })
  options = await parser.parseConfig(useConfigFile)

  // set the new options
  cli = cli.config(options)

  if (!options.strategy) {
    cli = cli.demandCommand(['strategy']).help()

    // eslint-disable-next-line no-unused-expressions
    cli.argv
  } else {
    // Execute the strategy
    // eslint-disable-next-line no-unused-expressions
    cli.parse([options.strategy]).argv
  }
}

async function initStrategyCli (yargs) {
  // Goes through each strategy definition
  // and creates a yargs command out of it
  // see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module
  Object.keys(loader.getStrategies()).forEach(stratName => {
    const cmd = loader.getStrategyConstructor(stratName).getCommandConfig(yargs)

    if (cmd) {
      if (!cmd.builder) {
        cmd.builder = () => {}
      }

      cmd.handler = execStrategy(stratName)

      yargs.command(cmd)
    }
  })
}

function execStrategy (stratName) {
  return async () => {
    console.info('Using version bump strategy:', stratName)

    const Strategy = loader.getStrategyConstructor(stratName)
    const vb = new VersionBump(options)

    await vb.initStrategy(Strategy)
    await vb.bumpVersion()

    process.exit(0)
  }
}

execCli()
  .then(() => {
    // purposely empty
    // because yargs calls the handler out of band
  })
  .catch(e => {
    console.error(e)
    process.exit(-1)
  })
