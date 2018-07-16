import { BUMP_LEVEL } from './consts'

export default function bumpVersionData (versionData, bumpLevel, {
  logger
} = { logger: console }) {
  if (!versionData) {
    throw new Error('versionData object is required for bumping')
  }

  switch (bumpLevel) {
    case BUMP_LEVEL.MAJOR:
      logger.info('Bumping major version...')

      versionData.major += 1
      versionData.minor = 0
      versionData.patch = 0
      versionData.pre = undefined
      versionData.build = undefined
      break
    case BUMP_LEVEL.MINOR:
      logger.info('Bumping minor version...')

      versionData.minor += 1
      versionData.patch = 0
      versionData.pre = undefined
      versionData.build = undefined
      break
    case BUMP_LEVEL.PATCH:
      logger.info('Bumping patch version...')

      versionData.patch += 1
      versionData.pre = undefined
      versionData.build = undefined
      break
    case BUMP_LEVEL.PRE_BUMP:
      logger.info('Bumping pre version...')

      if (!versionData.pre) {
        versionData.patch += 1
      }

      versionData.pre = bumpArray(versionData.pre)
      break
    case BUMP_LEVEL.BUILD_BUMP:
      logger.info('Bumping build version...')

      versionData.build = bumpArray(versionData.build)
      break
    case BUMP_LEVEL.LOWEST:
    default:
      logger.info('Bumping lowest version...')

      if (versionData.build) {
        versionData.build = bumpArray(versionData.build)
        break
      }

      if (versionData.pre) {
        versionData.pre = bumpArray(versionData.pre)
        break
      }

      versionData.patch += 1
  }

  return versionData
}

function bumpArray (data) {
  if (!Array.isArray(data)) {
    return [1]
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
