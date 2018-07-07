import { parseSemVer } from 'semver-parser'
import { parseOptions } from '../utils'

export default class BaseVersionStrategy {
  /**
   * @param {string} currentVersion Version from package.json
   * @param {object} options
   * @param {object} [options.strategyOptions] Options specific to the strategy
   */
  constructor (currentVersion, options = {}) {
    this.currentVersion = parseSemVer(currentVersion)
    this.options = options
  }

  async init () {
    this.strategyOptions = await parseOptions(this.options.strategyOptions) || {}
  }

  /**
   * Describes the options specific to the strategy
   * @param {commander} program Commander module instance
   */
  initCliOptions (program) {}

  /**
   * Short name for the strategy. Used as the command name
   * on the CLI.
   */
  getStrategyName () {
    throw new Error('getStrategyName() is not defined')
  }

  getOptions () {
    return this.options
  }

  getStrategyOptions () {
    return this.strategyOptions
  }

  /**
   * Returns a structure that contains metadata about the parsed version.
   * @returns {Object} Partial result of semver-parser#parseSemVer
   */
  getCurrentVersion () {
    return {
      major: this.currentVersion.major,
      minor: this.currentVersion.minor,
      patch: this.currentVersion.patch,
      pre: this.currentVersion.pre,
      build: this.currentVersion.build
    }
  }

  /**
   * Returns the next release version to update the versionFile with.
   * @returns {Promise<string>}
   */
  async getNextVersion () {
    throw new Error('getNextVersion() is not implemented')
  }
}
