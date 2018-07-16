#!/usr/bin/env node

import program from 'commander'
import StrategyLoader from '../StrategyLoader'
import VersionBump from '../VersionBump'

const debug = require('debug')('version-bump-cli')

const loader = new StrategyLoader()

const packageData = require('../../package.json')

// Modification of https://github.com/tj/commander.js/blob/master/index.js
program.commandHelp = function () {
  if (!this.commands.length) return ''

  const commands = this.prepareCommands()
  const width = this.padWidth()

  return [
    '  Strategies: (use version-bump <strategy> --help for more info)',
    '',
    commands.map(function (cmd) {
      const desc = cmd[1] ? '  ' + cmd[1] : ''
      return (desc ? pad(cmd[0], width) : cmd[0]) + desc
    }).join('\n').replace(/^/gm, '    '),
    ''
  ].join('\n')
}

function pad (str, width) {
  const len = Math.max(0, width - str.length)
  return str + Array(len + 1).join(' ')
}
// end modifications

function initStrategyCli () {
  Object.keys(loader.getStrategies()).forEach((stratName) => {
    const p = loader.getStrategyConstructor(stratName).initCliOptions(program)

    if (p) {
      p.action(async (options) => {
        try {
          console.info('Using version bump strategy:', stratName)

          const Strategy = loader.getStrategyConstructor(stratName)

          const vb = new VersionBump({
            ...options.parent.opts(),
            strategyOptions: options.opts()
          })
          await vb.init({ Strategy })
          await vb.bumpVersion()
        } catch (e) {
          debug(e)
          console.error(e.message)
        }
      })
    } else {
      throw new Error('CLI not defined for: ' + stratName)
    }
  })
}

program
  .version(packageData.version)
  .usage('[options] <strategy>')
  .option('--configFile [fileName]', `Name of the optional config file, relative to projectRoot.
                                    Default is ".version-pump.js".`)
  .option('--projectRoot [path]', `The project root where the version file is found.
                                    Default is process.cwd().`)
  .option('--versionFile [fileName]', `The relative path to the JSON version file from projectRoot
                                    that contains the "version" property.
                                    Default is "package.json".`)

initStrategyCli()

if (!process.argv[2]) {
  program.help()
}

program.parse(process.argv)
