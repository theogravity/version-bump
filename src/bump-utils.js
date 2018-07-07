import {BUMP_LEVEL} from './consts'

export function bumpVersion (versionData, bumpLevel) {
  switch (bumpLevel) {
    case BUMP_LEVEL.MAJOR:
      versionData.major += 1
      versionData.minor = 0
      versionData.patch = 0
      versionData.pre = undefined
      versionData.build = undefined
      break
    case BUMP_LEVEL.MINOR:
      versionData.minor += 1
      versionData.patch = 0
      versionData.pre = undefined
      versionData.build = undefined
      break
    case BUMP_LEVEL.PATCH:
      versionData.patch += 1
      versionData.pre = undefined
      versionData.build = undefined
      break
    case BUMP_LEVEL.PRE_BUMP:
      versionData.pre = bumpArray(versionData.pre)
      break
    case BUMP_LEVEL.BUILD_BUMP:
      versionData.build = bumpArray(versionData.build)
      break
    case BUMP_LEVEL.LOWEST:
    default:
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

// See grammar for semver rules
// https://github.com/semver/semver/blob/master/semver.md#backusnaur-form-grammar-for-valid-semver-versions
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
