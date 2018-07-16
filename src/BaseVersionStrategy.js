import { parseSemVer } from 'semver-parser'
import { parseOptions } from './utils'

export default class BaseVersionStrategy {
  static description = 'Performs a version bump based on command line options.'
  static strategyShortName = 'cli'

  /**
   * @param {object} options
   * @param {object} [options.strategyOptions] Options specific to the strategy
   */
  constructor (options = {}, { logger } = { logger: console }) {
    this.currentVersion = null
    this.options = options
    this.strategyOptions = null
    this.logger = logger
  }

  getLogger () {
    return this.logger
  }

  /**
   * @param {string} currentVersion Version from package.json
   */
  async init ({ currentVersion }) {
    if (!currentVersion) {
      throw new Error('Strategy init is missing currentVersion')
    }

    this.currentVersion = parseSemVer(currentVersion)
    this.strategyOptions = await parseOptions(this.options.strategyOptions) || {}
  }

  /**
   * Describes the options specific to the strategy
   * @param {commander} program Commander module instance
   * @returns {commander}
   */
  static initCliOptions (program) {
    return program
      .command(`${BaseVersionStrategy.strategyShortName} <options>`)
      .description(BaseVersionStrategy.description)
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
