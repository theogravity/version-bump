/* eslint-env jest */

import CliBumpStrategy from '../CliBumpStrategy'

describe('CliBumpStrategy', () => {
  it('should bump the major version', async () => {
    const s = new CliBumpStrategy({
      bump: 'major'
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 2,
      minor: 0,
      patch: 0,
      pre: undefined,
      matches: true,
      version: '2.0.0'
    })
  })

  it('should bump the major version 2', async () => {
    const s = new CliBumpStrategy({
      bump: 'major'
    })

    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 2,
      patch: 3,
      pre: undefined,
      matches: true,
      version: '1.2.3'
    })
  })

  it('should bump the minor version', async () => {
    const s = new CliBumpStrategy({
      bump: 'minor'
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 3,
      patch: 0,
      pre: undefined,
      matches: true,
      version: '1.3.0'
    })
  })

  it('should bump the patch version', async () => {
    const s = new CliBumpStrategy({
      bump: 'patch'
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 2,
      patch: 4,
      pre: undefined,
      matches: true,
      version: '1.2.4'
    })
  })

  it('should bump the pre-major version', async () => {
    const s = new CliBumpStrategy({
      bump: 'pre-major'
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 2,
      minor: 0,
      patch: 0,
      pre: [0],
      matches: true,
      version: '2.0.0-0'
    })
  })

  it('should bump the pre-minor version', async () => {
    const s = new CliBumpStrategy({
      bump: 'pre-minor'
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 3,
      patch: 0,
      pre: [0],
      matches: true,
      version: '1.3.0-0'
    })
  })

  it('should bump the pre-patch version', async () => {
    const s = new CliBumpStrategy({
      bump: 'pre-patch'
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 2,
      patch: 4,
      pre: [0],
      matches: true,
      version: '1.2.4-0'
    })
  })

  it('should bump the pre version', async () => {
    const s = new CliBumpStrategy({
      bump: 'pre-release'
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 2,
      patch: 4,
      pre: [0],
      matches: true,
      version: '1.2.4-0'
    })
  })

  it('should bump the pre version 2', async () => {
    const s = new CliBumpStrategy({
      bump: 'pre-release'
    })

    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 2,
      patch: 3,
      pre: ['pre', 2],
      matches: true,
      version: '1.2.3-pre.2'
    })
  })

  it('should bump the pre version 3', async () => {
    const s = new CliBumpStrategy({
      bump: 'pre-release:alpha'
    })

    await s.init({ currentVersion: '1.2.3-alpha.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 2,
      patch: 3,
      pre: ['alpha', 2],
      matches: true,
      version: '1.2.3-alpha.2'
    })
  })

  it('should bump the pre version 4', async () => {
    const s = new CliBumpStrategy({
      bump: 'pre-release:alpha'
    })

    await s.init({ currentVersion: '1.2.3-1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: undefined,
      major: 1,
      minor: 2,
      patch: 3,
      pre: ['alpha', 0],
      matches: true,
      version: '1.2.3-alpha.0'
    })
  })

  it('should bump the build version', async () => {
    const s = new CliBumpStrategy({
      bump: 'build-release'
    })

    await s.init({ currentVersion: '1.2.3' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: [0],
      major: 1,
      minor: 2,
      patch: 3,
      pre: undefined,
      matches: true,
      version: '1.2.3+0'
    })
  })

  it('should bump the build version 2', async () => {
    const s = new CliBumpStrategy({
      bump: 'build-release'
    })

    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: [0],
      major: 1,
      minor: 2,
      patch: 3,
      pre: ['pre', 1],
      matches: true,
      version: '1.2.3-pre.1+0'
    })
  })

  it('should bump the build version 3', async () => {
    const s = new CliBumpStrategy({
      bump: 'build-release:qa'
    })

    await s.init({ currentVersion: '1.2.3-pre.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: ['qa', 0],
      major: 1,
      minor: 2,
      patch: 3,
      pre: ['pre', 1],
      matches: true,
      version: '1.2.3-pre.1+qa.0'
    })
  })

  it('should bump the build version 4', async () => {
    const s = new CliBumpStrategy({
      bump: 'build-release:qa'
    })

    await s.init({ currentVersion: '1.2.3+qa.1' })

    const versionData = await s.getNextVersion()

    expect(versionData).toEqual({
      build: ['qa', 2],
      major: 1,
      minor: 2,
      patch: 3,
      pre: undefined,
      matches: true,
      version: '1.2.3+qa.2'
    })
  })
})
