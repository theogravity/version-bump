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
  constructor (options = {}) {
    this.options = options
    this.projectRoot = options.projectRoot || process.cwd()
    this.configFile = options.configFile || '.version-bump.js'
  }

  /**
   * Reads for a config file and returns the appropriate object for feeding
   * into other classes.
   * @returns {Promise<object>}
   */
  async parseConfig () {
    const configFile = join(this.projectRoot, this.configFile)

    if (existsSync(configFile)) {
      let options = {}
      try {
        options = require(configFile)
      } catch (e) {
        // It's ok if we don't find a config file
        // since it's optional.
        debug('Config file not found: ', configFile)
      }

      try {
        const projectRoot = await getValue(options.projectRoot)

        const newOptions = {
          ...await parseOptions(options, CONFIG_OPTIONS_TO_SKIP),
          ...this.options,
          // Speical case: if the config file has projectRoot,
          // use that value instead, even if it's specified on the
          // command line
          projectRoot
        }

        return newOptions
      } catch (e) {
        throw new Error(`Problem parsing config file: ${configFile}`)
      }
    }

    return {
      projectRoot: process.cwd(),
      versionFile: 'package.json',
      ...this.options
    }
  }
}
