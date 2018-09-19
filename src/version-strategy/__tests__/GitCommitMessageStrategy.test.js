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
    const s = new GitCommitMessageStrategy()

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 2,
      'minor': 0,
      'patch': 0,
      'pre': undefined,
      'matches': true,
      'version': '2.0.0'
    })
  })

  it('should bump the major version 2', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[major]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 2,
      'minor': 0,
      'patch': 0,
      'pre': undefined,
      'matches': true,
      'version': '2.0.0'
    })
  })

  it('should bump the minor version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[minor]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 3,
      'patch': 0,
      'pre': undefined,
      'matches': true,
      'version': '1.3.0'
    })
  })

  it('should bump the patch version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[patch]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 4,
      'pre': undefined,
      'matches': true,
      'version': '1.2.4'
    })
  })

  it('should bump the pre major version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[pre-major]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 2,
      'minor': 0,
      'patch': 0,
      'pre': [0],
      'matches': true,
      'version': '2.0.0-0'
    })
  })

  it('should bump the pre minor version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[pre-minor]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 3,
      'patch': 0,
      'pre': [0],
      'matches': true,
      'version': '1.3.0-0'
    })
  })

  it('should bump the pre patch version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[pre-patch]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 4,
      'pre': [0],
      'matches': true,
      'version': '1.2.4-0'
    })
  })

  it('should bump the pre version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[pre-release]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 4,
      'pre': [0],
      'matches': true,
      'version': '1.2.4-0'
    })
  })

  it('should bump the pre version 2', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[pre-release]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': ['pre', 2],
      'matches': true,
      'version': '1.2.3-pre.2'
    })
  })

  it('should bump the build version', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[build-release]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': [0],
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': undefined,
      'matches': true,
      'version': '1.2.3+0'
    })
  })

  it('should bump the build version 2', async () => {
    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[build-release]')
    })
    const s = new GitCommitMessageStrategy()
    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': [0],
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': ['pre', 1],
      'matches': true,
      'version': '1.2.3-pre.1+0'
    })
  })
})
