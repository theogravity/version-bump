import ConfigParser from './ConfigParser'
import { writeVersionFile, readVersionFile } from './utils'
import { join } from 'path'

export default class VersionBump {
  /**
   * Facade that interfaces to the changelog classes. Main entry point for the command line.
   * See the respective classes for parameter info.
   **/
  constructor (options, { logger } = { logger: console }) {
    this.options = options
    this.strategyInstance = null
    this.packageData = null
    this.logger = logger
  }

  /**
   * Call this first before calling one of the public facing methods.
   * @returns {Promise<void>}
   */
  async init ({ Strategy } = {}) {
    if (!Strategy) {
      throw new Error('VersionBump#init() requires the Strategy parameter')
    }

    const parser = new ConfigParser(this.options, { logger: this.logger })
    this.options = await parser.parseConfig()

    this.strategyInstance = new Strategy(this.options, {
      logger: this.logger
    })

    const {
      projectRoot,
      versionFile
    } = this.options

    this.packageData = await readVersionFile(projectRoot, versionFile, {
      logger: this.logger
    })

    await this.strategyInstance.init({
      currentVersion: this.packageData.version
    })
  }

  /**
   * Runs the procedures to update the version number
   * @returns {Promise<void>}
   */
  async bumpVersion () {
    const {
      projectRoot,
      versionFile,
      onBeforeRelease
    } = this.options

    if (!this.strategyInstance) {
      throw new Error('VersionBump#init() was not called before bumpVersion()')
    }

    const packageData = this.packageData

    let newVersion = await this.strategyInstance.getNextVersion()

    if (onBeforeRelease) {
      newVersion = await onBeforeRelease(newVersion)
    }

    this.logger.info('Old version:', packageData.version)

    packageData.version = versionObjToString(newVersion)

    this.logger.info('New version:', packageData.version)

    this.logger.info('Version updated in:', join(projectRoot, versionFile))

    await writeVersionFile(projectRoot, versionFile, JSON.stringify(packageData, 0, 2) + '\n')
  }
}

// See grammar for semver rules
// https://github.com/semver/semver/blob/master/semver.md#backusnaur-form-grammar-for-valid-semver-versions
function versionObjToString (versionData) {
  let version = `${versionData.major}.${versionData.minor}.${versionData.patch}`

  if (versionData.pre && versionData.pre.length > 0) {
    version = version + '-' + versionData.pre.join('.')
  }

  if (versionData.build && versionData.build.length > 0) {
    version = version + '+' + versionData.build.join('.')
  }

  return version
}
