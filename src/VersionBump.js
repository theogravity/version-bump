import { readVersionFile, writeVersionFile } from './utils'
import { join } from 'path'
import { versionObjToString } from './version-utils'

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
  async initStrategy (Strategy) {
    if (!Strategy) {
      throw new Error(
        'VersionBump#initStrategy() requires the Strategy parameter'
      )
    }

    this.strategyInstance = new Strategy(this.options, {
      logger: this.logger
    })

    const { projectRoot, versionFile } = this.options

    if (!versionFile) {
      throw new Error('Required option not defined: versionFile')
    }

    if (!projectRoot) {
      throw new Error('Required option not defined: projectRoot')
    }

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
    const { projectRoot, versionFile, onBeforeRelease } = this.options

    if (!this.strategyInstance) {
      throw new Error('VersionBump#init() was not called before bumpVersion()')
    }

    this.logger.info('Executing strategy...')

    const packageData = this.packageData

    // execute the strategy
    let newVersion = await this.strategyInstance.getNextVersion()

    if (onBeforeRelease) {
      newVersion = await onBeforeRelease(newVersion)
    }

    this.logger.info('Old version:', packageData.version)

    packageData.version = versionObjToString(newVersion)

    this.logger.info('New version:', packageData.version)

    if (this.options.simulate) {
      this.logger.info('Simulate option used. Version file not updated.')
      return
    }

    this.logger.info('Version updated in:', join(projectRoot, versionFile))

    await writeVersionFile(
      projectRoot,
      versionFile,
      JSON.stringify(packageData, 0, 2) + '\n'
    )
  }
}
