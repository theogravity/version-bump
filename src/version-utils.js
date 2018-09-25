import { BUMP_LEVEL } from './consts'

export function bumpVersionData (
  versionData,
  bumpLevel,
  { logger } = { logger: console }
) {
  if (!versionData) {
    throw new Error('versionData object is required for bumping')
  }

  let newVersionData = {
    ...versionData
  }

  switch (bumpLevel) {
    case BUMP_LEVEL.MAJOR:
      logger.info('Bumping major version...')
      // If a pre-release exists, then this is going to be the
      // first non-pre release for that version
      // so no update to the major version happens
      if (newVersionData.pre) {
        newVersionData.pre = undefined
        newVersionData.build = undefined
        break
      }

      newVersionData.major += 1
      newVersionData.minor = 0
      newVersionData.patch = 0

      newVersionData.pre = undefined
      newVersionData.build = undefined
      break
    case BUMP_LEVEL.MINOR:
      logger.info('Bumping minor version...')
      if (newVersionData.pre) {
        newVersionData.pre = undefined
        newVersionData.build = undefined
        break
      }

      newVersionData.minor += 1
      newVersionData.patch = 0

      newVersionData.pre = undefined
      newVersionData.build = undefined
      break
    case BUMP_LEVEL.PATCH:
      logger.info('Bumping patch version...')
      if (newVersionData.pre) {
        newVersionData.pre = undefined
        newVersionData.build = undefined
        break
      }

      newVersionData.patch += 1
      newVersionData.pre = undefined
      newVersionData.build = undefined
      break
    case BUMP_LEVEL.PRE_MAJOR:
      logger.info('Bumping pre-major version...')
      newVersionData.major += 1
      newVersionData.minor = 0
      newVersionData.patch = 0

      newVersionData.build = undefined
      newVersionData.pre = [0]
      break
    case BUMP_LEVEL.PRE_MINOR:
      logger.info('Bumping pre-minor version...')
      newVersionData.minor += 1
      newVersionData.patch = 0

      newVersionData.build = undefined
      newVersionData.pre = [0]
      break
    case BUMP_LEVEL.PRE_PATCH:
      logger.info('Bumping pre-patch version...')
      newVersionData.patch += 1

      newVersionData.build = undefined
      newVersionData.pre = [0]
      break
    case BUMP_LEVEL.PRE_RELEASE:
      logger.info('Bumping pre-release version...')
      if (!versionData.pre) {
        newVersionData.patch += 1
      }

      newVersionData.build = undefined
      newVersionData.pre = bumpArray(versionData.pre)
      break
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
        newVersionData.pre = bumpArray(versionData.pre)
        break
      }

      newVersionData.patch += 1
      newVersionData.pre = undefined
      newVersionData.build = undefined
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
  for (let i = data.length - 1; i > -1; i--) {
    if (Number.isInteger(data[i])) {
      data[i] += 1
      return data
    }
  }

  return data
}
