/* eslint-env jest */
import GitCommitMessageStrategy from '../GitCommitMessageStrategy'
import {getLastCommit} from 'git-last-commit'

jest.mock('git-last-commit', function () {
  return {
    getLastCommit: jest.fn()
  }
})

describe('GitCommitMessageStrategy', () => {
  it('should bump the major version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[major]')
    })
    const s = new GitCommitMessageStrategy('1.2.3', {})
    await s.init()

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 2,
      'minor': 0,
      'patch': 0,
      'pre': undefined
    })
  })

  it('should bump the major version 2', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[major]')
    })
    const s = new GitCommitMessageStrategy('1.2.3-pre.1', {})
    await s.init()

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 2,
      'minor': 0,
      'patch': 0,
      'pre': undefined
    })
  })

  it('should bump the minor version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[minor]')
    })
    const s = new GitCommitMessageStrategy('1.2.3', {})
    await s.init()

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 3,
      'patch': 0,
      'pre': undefined
    })
  })

  it('should bump the patch version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[patch]')
    })
    const s = new GitCommitMessageStrategy('1.2.3', {})
    await s.init()

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 4,
      'pre': undefined
    })
  })

  it('should bump the pre version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[pre-bump]')
    })
    const s = new GitCommitMessageStrategy('1.2.3', {})
    await s.init()

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': [1]
    })
  })

  it('should bump the pre version 2', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[pre-bump]')
    })
    const s = new GitCommitMessageStrategy('1.2.3-pre.1', {})
    await s.init()

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': ['pre', 2]
    })
  })

  it('should bump the build version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[build-bump]')
    })
    const s = new GitCommitMessageStrategy('1.2.3', {})
    await s.init()

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': [1],
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': undefined
    })
  })

  it('should bump the build version 2', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[build-bump]')
    })
    const s = new GitCommitMessageStrategy('1.2.3-pre.1', {})
    await s.init()

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': [1],
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': ['pre', 1]
    })
  })
})
