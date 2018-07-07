import { VERSION_STRATEGIES } from '../consts'

import GitCommitMessageStrategy from './GitCommitMessageStrategy'
import CliBumpStrategy from './CliBumpStrategy'

export async function getVersionStrategyInstance (version, options) {
  let instance = null

  switch (options.bumpStrategy) {
    case VERSION_STRATEGIES.CLI:
      instance = new CliBumpStrategy(version, options)
      break
    case VERSION_STRATEGIES.GIT_COMMIT_MSG:
    default:
      instance = new GitCommitMessageStrategy(version, options)
  }

  await instance.init()
  return instance
}
