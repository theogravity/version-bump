#!/usr/bin/env node

import yargs from 'yargs'

import StrategyLoader from '../StrategyLoader'
import VersionBump from '../VersionBump'

const debug = require('debug')('version-bump-cli')
const loader = new StrategyLoader()
const packageData = require('../../package.json')

function execCli () {
  // eslint-disable-next-line no-unused-expressions
  let cli = yargs
    .version(packageData.version)
    .usage('version-bump')
    .wrap(120)
    .options({
      'projectRoot': {
        describe: 'The project root where the version file is found. Default is process.cwd()',
        default: process.cwd()
      },
      'configFile': {
        describe: 'Name of the optional config file, relative to projectRoot.',
        default: '.version-bump.js'
      },
      'versionFile': {
        describe: 'The relative path to the JSON version file from projectRoot ' +
          'that contains the "version" property.',
        default: 'package.json'
      }
    })
    .demandCommand()
    .help()

  initStrategyCli(cli)

  // eslint-disable-next-line no-unused-expressions
  cli.argv
}

function initStrategyCli (yargs) {
  Object.keys(loader.getStrategies()).forEach((stratName) => {
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
  return async (params) => {
    try {
      console.info('Using version bump strategy:', stratName)

      const Strategy = loader.getStrategyConstructor(stratName)
      const vb = new VersionBump(params)
      await vb.initStrategy(Strategy)
      await vb.bumpVersion()
    } catch (e) {
      debug(e)
      console.error(e.message)
    }
  }
}

execCli()
