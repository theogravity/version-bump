import { BUMP_LEVEL } from './consts'
import { parseSemVer } from 'semver-parser'

import semver from 'semver'

export function bumpVersionData (versionData, bumpLevel, {
  logger
} = { logger: console }) {
  if (!versionData) {
    throw new Error('versionData object is required for bumping')
  }

  let currVersion = versionData.version
  let newVersionData = {
    ...versionData
  }

  switch (bumpLevel) {
    case BUMP_LEVEL.MAJOR:
      logger.info('Bumping major version...')
      return parseSemVer(semver.inc(currVersion, 'major'))
    case BUMP_LEVEL.MINOR:
      logger.info('Bumping minor version...')
      return parseSemVer(semver.inc(currVersion, 'minor'))
    case BUMP_LEVEL.PATCH:
      logger.info('Bumping patch version...')
      return parseSemVer(semver.inc(currVersion, 'patch'))
    case BUMP_LEVEL.PRE_MAJOR:
      logger.info('Bumping pre-major version...')
      return parseSemVer(semver.inc(currVersion, 'premajor'))
    case BUMP_LEVEL.PRE_MINOR:
      logger.info('Bumping pre-minor version...')
      return parseSemVer(semver.inc(currVersion, 'preminor'))
    case BUMP_LEVEL.PRE_PATCH:
      logger.info('Bumping pre-patch version...')
      return parseSemVer(semver.inc(currVersion, 'prepatch'))
    case BUMP_LEVEL.PRE_RELEASE:
      logger.info('Bumping pre-release version...')
      return parseSemVer(semver.inc(currVersion, 'prerelease'))
    case BUMP_LEVEL.BUILD_RELEASE:
      logger.info('Bumping build-release version...')

      newVersionData.build = bumpArray(versionData.build)
      break
    case BUMP_LEVEL.LOWEST:
    default:
      logger.info('Bumping lowest version...')

      if (versionData.build) {
        newVersionData.build = bumpArray(versionData.build)
        break
      }

      if (versionData.pre) {
        return parseSemVer(semver.inc(versionData.version, 'prerelease'))
      }

      return parseSemVer(semver.inc(versionData.version, 'patch'))
  }

  newVersionData.version = versionObjToString(newVersionData)
  return newVersionData
}

// https://github.com/semver/semver/blob/master/semver.md#backusnaur-form-grammar-for-valid-semver-versions
// See grammar for semver rules
export function versionObjToString (versionData) {
  let version = `${versionData.major}.${versionData.minor}.${versionData.patch}`

  if (versionData.pre && versionData.pre.length > 0) {
    version = version + '-' + versionData.pre.join('.')
  }

  if (versionData.build && versionData.build.length > 0) {
    version = version + '+' + versionData.build.join('.')
  }

  return version
}

export function bumpArray (data) {
  if (!Array.isArray(data)) {
    return [0]
  }

  // detect if the array has an integer value, if not, insert it in
  const hasInteger = data.some(Number.isInteger)

  if (!hasInteger) {
    // it'll be incremented in the next phase
    data.push(-1)
  }

  // find the first integer value in the array, starting backwards and increment it
  for (let i = (data.length - 1); i > -1; i--) {
    if (Number.isInteger(data[i])) {
      data[i] += 1
      return data
    }
  }

  return data
}
