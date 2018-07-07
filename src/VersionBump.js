import ConfigParser from './ConfigParser'

import { getVersionStrategyInstance } from './version-strategy'
import {writeVersionFile, readVersionFile} from './utils'
import { versionObjToString } from './bump-utils'

export default class VersionBump {
  /**
   * Facade that interfaces to the changelog classes. Main entry point for the command line.
   * See the respective classes for parameter info.
   **/
  constructor (options) {
    this.options = options
  }

  /**
   * Call this first before calling one of the public facing methods.
   * @returns {Promise<void>}
   */
  async init () {
    const parser = new ConfigParser(this.options)
    this.options = await parser.parseConfig()
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

    const packageData = await readVersionFile(projectRoot, versionFile)
    const strategy = await getVersionStrategyInstance(packageData.version, this.options)
    let newVersion = await strategy.getNextVersion()

    if (onBeforeRelease) {
      newVersion = await onBeforeRelease(newVersion)
    }

    packageData.version = versionObjToString(newVersion)
    await writeVersionFile(projectRoot, versionFile, JSON.stringify(packageData))
  }
}
