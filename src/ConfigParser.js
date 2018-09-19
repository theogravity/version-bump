import { join } from 'path'
import {
  // node docs does not recommend using the async version
  existsSync
} from 'fs'
import {getValue, parseOptions} from './utils'

const debug = require('debug')('config-parser')

const CONFIG_OPTIONS_TO_SKIP = {
  onBeforeRelease: true,
  onAfterRelease: true,
  projectRoot: true,
  configFile: true
}

/**
 * Parses a config file into options that are consumable by other classes.
 */
export default class ConfigParser {
  /**
   * @param {string} [options.configFile] Name of the version bump config file, relative to projectRoot.
   * Default is '.version-bump.js'
   * @param {string} [options.projectRoot] The project root where the package.json file
   * is found. Default is process.cwd()
   */
  constructor (options = {}, { logger } = { logger: console }) {
    this.options = options
    this.projectRoot = options.projectRoot || process.cwd()
    this.configFile = options.configFile || '.version-bump.js'
    this.logger = logger
  }

  /**
   * Reads for a config file and returns the appropriate object for feeding
   * into other classes.
   * @returns {Promise<object>}
   */
  async parseConfig (useConfigFile = true) {
    const configFile = join(this.projectRoot, this.configFile)
    let options = {}
    let defaultOptions = this.options

    if (useConfigFile && existsSync(configFile)) {
      this.logger.info(`Using config file: ${configFile}`)

      try {
        options = require(configFile)
      } catch (e) {
        debug(e)
        throw new Error(`Problem requiring file: ${configFile}`)
      }

      const projectRoot = await getValue(options.projectRoot)

      const calculatedOptions = await parseOptions(options, CONFIG_OPTIONS_TO_SKIP)

      defaultOptions = {
        ...calculatedOptions,
        ...this.options,
        // Speical case: if the config file has projectRoot,
        // use that value instead, even if it's specified on the
        // command line
        projectRoot
      }

      if (!defaultOptions.strategy) {
        throw new Error('Config file is missing required field: strategy')
      }
    }

    if (!defaultOptions.projectRoot) {
      defaultOptions.projectRoot = process.cwd()
    }

    if (!defaultOptions.versionFile) {
      defaultOptions.versionFile = 'package.json'
    }

    return defaultOptions
  }
}
