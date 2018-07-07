import util from 'util'

import BaseVersionStrategy from './BaseVersionStrategy'
import { getLastCommit } from 'git-last-commit'
import { bumpVersion } from '../bump-utils'
import { BUMP_LEVEL } from '../consts'

const getLastCommitAsync = util.promisify(getLastCommit)

/**
 * Performs a version bump if the git commit message contains the following:
 * - [major]
 * - [minor]
 * - [patch]
 * - [pre-bump] Bumps the pre version for the first found integer version
 * - [build-bump] Bumps the build version for the first found integer version
 *
 * If there are no tags defined, then the lowest level is assumed.
 *
 * See https://github.com/asamuzaK/semverParser#parsesemverversion-strict for more information.
 */
export default class GitCommitMessageStrategy extends BaseVersionStrategy {
  getStrategyName () {
    return 'git-commit-msg'
  }

  initCliOptions (program) {
    program
      .command(`${this.getStrategyName()} <options>`)
      .description(`Uses the last git commit subject to determine the bump level. Will bump based
    on the following text:
    
      * [major]
      * [minor]
      * [patch]
      * [pre]
      * [build]
      * [pre:<colon-sep-tags>] ([pre:alpha:rc])
      * [build:<colon-sep-tags>] ([build:qa])
    
    Default is the lowest version possible.`)
  }

  /**
   * Returns the next release version to update the versionFile with.
   * @returns {Promise<Object>} semver parsed object
   */
  async getNextVersion () {
    const lastCommit = await getLastCommitAsync()
    const bumpLevel = this._determineBumpLevel(lastCommit)
    let versionData = this.getCurrentVersion()
    return bumpVersion(versionData, bumpLevel)
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

    if (message.includes('[pre-bump]')) {
      return BUMP_LEVEL.PRE_BUMP
    }

    if (message.includes('[build-bump]')) {
      return BUMP_LEVEL.BUILD_BUMP
    }

    return BUMP_LEVEL.LOWEST
  }
}
