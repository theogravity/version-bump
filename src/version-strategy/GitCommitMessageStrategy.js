import util from 'util'

import BaseVersionStrategy from '../BaseVersionStrategy'
import { getLastCommit } from 'git-last-commit'
import bumpVersionData from '../bump-version-data'
import { BUMP_LEVEL } from '../consts'

const getLastCommitAsync = util.promisify(getLastCommit)

/**
 * Performs a version bump if the git commit message contains the following:
 * - [major]
 * - [minor]
 * - [patch]
 * - [pre-release] Bumps the pre version for the first found integer version
 * - [build-release] Bumps the build version for the first found integer version
 *
 * If there are no tags defined, then the lowest level is assumed.
 *
 * See https://github.com/asamuzaK/semverParser#parsesemverversion-strict for more information.
 */
export default class GitCommitMessageStrategy extends BaseVersionStrategy {
  static strategyShortName = 'git-commit-msg'

  static getCommandConfig () {
    return {
      command: GitCommitMessageStrategy.strategyShortName,
      describe: `Uses the last git commit subject to determine the bump level. Will bump based on the following text:
        
          * [major]
          * [minor]
          * [patch]
          * [pre-major]
          * [pre-minor]
          * [pre-patch]
          * [pre-release]
          * [build-release]
        
        Default is the lowest version possible.`
    }
  }

  /**
   * Returns the next release version to update the versionFile with.
   * @returns {Promise<Object>} semver parsed object
   */
  async getNextVersion () {
    const lastCommit = await getLastCommitAsync()
    const bumpLevel = this._determineBumpLevel(lastCommit)
    let versionData = this.getCurrentVersion()
    return bumpVersionData(versionData, bumpLevel, {
      logger: this.getLogger()
    })
  }

  _determineBumpLevel (message) {
    if (!message || typeof message !== 'string') {
      return BUMP_LEVEL.LOWEST
    }

    if (message.includes('[major]')) {
      return BUMP_LEVEL.MAJOR
    }

    if (message.includes('[minor]')) {
      return BUMP_LEVEL.MINOR
    }

    if (message.includes('[patch]')) {
      return BUMP_LEVEL.PATCH
    }

    if (message.includes('[pre-major]')) {
      return BUMP_LEVEL.PRE_MAJOR
    }

    if (message.includes('[pre-minor]')) {
      return BUMP_LEVEL.PRE_MINOR
    }

    if (message.includes('[pre-patch]')) {
      return BUMP_LEVEL.PRE_PATCH
    }

    if (message.includes('[pre-release]')) {
      return BUMP_LEVEL.PRE_RELEASE
    }

    if (message.includes('[build-release]')) {
      return BUMP_LEVEL.BUILD_RELEASE
    }

    return BUMP_LEVEL.LOWEST
  }
}
