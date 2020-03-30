import BaseVersionStrategy from '../BaseVersionStrategy'
import { BUMP_LEVEL } from '../consts'
import { bumpVersionData } from '../version-utils'
import { IVersionBump } from '../interfaces'

export interface CliBumpStrategyConfig
  extends IVersionBump.BaseVersionStrategyOptions {
  bump: string
}

/**
 * Performs a version bump based on the --bump flag
 * eg:
 * --bump patch
 * --bump minor
 * --bump major
 * --bump pre-major
 * --bump pre-minor
 * --bump pre-patch
 * --bump pre-release
 * --bump pre-*:<colon-separated-tags> eg (pre-release:alpha)
 * --bump build-release
 * --bump build-release:<colon-separated-tags> eg (build-release:qa)
 */
export default class CliBumpStrategy extends BaseVersionStrategy<
  CliBumpStrategyConfig
> {
  bump: string

  static strategyShortName = 'cli'

  async init ({ currentVersion }) {
    await BaseVersionStrategy.prototype.init.call(this, { currentVersion })
    this.bump = this.getOptions().bump
  }

  static getCommandConfig () {
    return {
      command: `${CliBumpStrategy.strategyShortName} [bump]`,
      describe: 'Performs a version bump based on the --bump flag',
      builder: yargs => {
        yargs.positional('bump', {
          describe: `Version type to bump.

                    Values can be:
                        * major
                        * minor
                        * patch
                        * pre-major
                        * pre-minor
                        * pre-patch
                        * pre-release
                        * pre-*:<colon-sep-tags> (pre-release:alpha:rc)
                        * build-release
                        * build-release:<colon-sep-tags> (build-release:qa)
      
                    Default is the lowest version possible.`
        })
      }
    }
  }

  async getNextVersion (): Promise<IVersionBump.ParsedSemVerResult> {
    const bumpLevel = this._determineBumpLevel(this.bump)
    let versionData = this.getCurrentVersion()

    // check if the pre/build is using any custom tag
    if (
      typeof this.bump === 'string' &&
      (this.bump.includes('pre') || this.bump.includes('build')) &&
      this.bump.includes(':')
    ) {
      // extract the tag
      const tags = this.bump.split(':')

      // remove the 0th entry since that's the pre/build label
      tags.shift()

      // Compare the proposed tags against the existing one
      let compare = []

      switch (bumpLevel) {
        case BUMP_LEVEL.PRE_MAJOR:
        case BUMP_LEVEL.PRE_MINOR:
        case BUMP_LEVEL.PRE_PATCH:
        case BUMP_LEVEL.PRE_RELEASE:
          compare = versionData.pre || []
          break
        case BUMP_LEVEL.BUILD_RELEASE:
          compare = versionData.build || []
          break
      }

      // go through the new tags to use and compare to the existing ones
      // if they do not match, then we consider it to be a fresh bump
      if (!tags.every((tag, idx) => tag === compare[idx])) {
        switch (bumpLevel) {
          case BUMP_LEVEL.PRE_RELEASE:
            versionData.pre = tags
            break
          case BUMP_LEVEL.BUILD_RELEASE:
            versionData.build = tags
            break
        }
      }
    }

    versionData = bumpVersionData(versionData, bumpLevel, {
      logger: this.getLogger()
    })

    return versionData
  }

  /**
   * Returns the bump level to use based on the bump type input
   */
  _determineBumpLevel (bumpType): BUMP_LEVEL {
    if (!bumpType || typeof bumpType !== 'string') {
      return BUMP_LEVEL.LOWEST
    }

    if (bumpType === 'major') {
      return BUMP_LEVEL.MAJOR
    }

    if (bumpType === 'minor') {
      return BUMP_LEVEL.MINOR
    }

    if (bumpType === 'patch') {
      return BUMP_LEVEL.PATCH
    }

    if (bumpType === 'pre-major') {
      return BUMP_LEVEL.PRE_MAJOR
    }

    if (bumpType === 'pre-minor') {
      return BUMP_LEVEL.PRE_MINOR
    }

    if (bumpType === 'pre-patch') {
      return BUMP_LEVEL.PRE_PATCH
    }

    if (bumpType.includes('pre-release')) {
      return BUMP_LEVEL.PRE_RELEASE
    }

    if (bumpType.includes('build-release')) {
      return BUMP_LEVEL.BUILD_RELEASE
    }

    if (!bumpType) {
      return BUMP_LEVEL.LOWEST
    }

    throw new Error('Unsupported bump option: ' + bumpType)
  }
}
