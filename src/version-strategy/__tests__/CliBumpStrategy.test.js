/* eslint-env jest */

import CliBumpStrategy from '../CliBumpStrategy'

describe('CliBumpStrategy', () => {
  it('should bump the major version', async () => {
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'major'
      }
    })

    await s.init({ currentVersion: '1.2.3' })

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
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'major'
      }
    })

    await s.init({ currentVersion: '1.2.3-pre.1' })

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
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'minor'
      }
    })

    await s.init({ currentVersion: '1.2.3' })

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
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'patch'
      }
    })

    await s.init({ currentVersion: '1.2.3' })

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
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'pre'
      }
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 4,
      'pre': [1]
    })
  })

  it('should bump the pre version 2', async () => {
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'pre'
      }
    })

    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': ['pre', 2]
    })
  })

  it('should bump the pre version 3', async () => {
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'pre:alpha'
      }
    })

    await s.init({ currentVersion: '1.2.3-alpha.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': undefined,
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': ['alpha', 2]
    })
  })

  it('should bump the build version', async () => {
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'build'
      }
    })

    await s.init({ currentVersion: '1.2.3' })

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
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'build'
      }
    })

    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': [1],
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': ['pre', 1]
    })
  })

  it('should bump the build version 3', async () => {
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'build:qa'
      }
    })

    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': ['qa', 1],
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': ['pre', 1]
    })
  })

  it('should bump the build version 4', async () => {
    const s = new CliBumpStrategy({
      strategyOptions: {
        bump: 'build:qa'
      }
    })

    await s.init({ currentVersion: '1.2.3+qa.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      'build': ['qa', 2],
      'major': 1,
      'minor': 2,
      'patch': 3,
      'pre': undefined
    })
  })
})
