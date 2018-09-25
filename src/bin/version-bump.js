#!/usr/bin/env node

import yargs from 'yargs'

import StrategyLoader from '../StrategyLoader'
import VersionBump from '../VersionBump'
import ConfigParser from '../ConfigParser'
import { readVersionFile } from '../utils'

const loader = new StrategyLoader()
const packageData = require('../../package.json')

let options = {}

async function execCli () {
  // eslint-disable-next-line no-unused-expressions
  let cli = yargs
    .version(packageData.version)
    .usage('$0 <strategy>')
    .updateStrings({
      'Commands:': 'Versioning Strategies:\n'
    })
    .wrap(120)
    .options({
      projectRoot: {
        describe:
          'The project root where the version file is found. Default is process.cwd()',
        default: process.cwd()
      },
      configFile: {
        describe: 'Name of the optional config file, relative to projectRoot.'
      },
      versionFile: {
        describe:
          'The relative path to the JSON version file from projectRoot ' +
          'that contains the "version" property.',
        default: 'package.json'
      },
      simulate: {
        describe: 'Simulates the version bump. Does not write data.',
        type: 'boolean',
        default: false
      }
    })
    .example('$0 cli major')
    .example('$0 cli --bump minor')

  cli.command(
    'show-version',
    '(not a strategy) Reads the version and outputs it.',
    yargs => {
      return yargs
    },
    async params => {
      const contents = await readVersionFile(
        params.projectRoot,
        params.versionFile,
        {
          logger: {
            info: () => {}
          }
        }
      )
      console.log(contents.version)
      process.exit(0)
    }
  )

  // This loads the strategies and allows yargs to list them in the commands listing
  await initStrategyCli(cli)

  // User did not explicity define a command to use
  // check if a config file exists and use that if it does
  const useConfigFile = cli.argv._.length === 0

  const parser = new ConfigParser(cli.argv, { logger: console })
  options = await parser.parseConfig(useConfigFile)

  // set the new options
  cli = cli.config(options)

  // when built as a standalone binary, strategy does not seem to be registered
  // so capture what the strategy is here
  const strategy = options.strategy || options._[0]

  if (!strategy && !options._usingConfig) {
    cli.showHelp()

    throw new Error(
      'A strategy was not specified, or the specified config file could not be found.'
    )
  } else if (strategy === 'show-version') {
    // show-version is not a strategy, run it as a normal yargs command
    // eslint-disable-next-line no-unused-expressions
    cli.argv
  } else {
    if (!loader.strategyExists(strategy)) {
      throw new Error(
        `Strategy does not exist: ${strategy}. Use --help to see a list of strategies.`
      )
    }

    // Execute the strategy
    // eslint-disable-next-line no-unused-expressions
    cli.parse([strategy]).argv
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
  return async params => {
    console.info('Using version bump strategy:', stratName)

    const Strategy = loader.getStrategyConstructor(stratName)
    const vb = new VersionBump(params)

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
