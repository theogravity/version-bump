/* eslint-env jest */

import fsMock from 'mock-fs'
import VersionBump from '../VersionBump'
import { readVersionFile } from '../utils'
import CliBumpStrategy from '../version-strategy/CliBumpStrategy'

// fs-mock doesn't like console.logs
// https://github.com/tschaub/mock-fs/issues/234
import logger from '../__mocks__/logger'

const defaultVersionContent = '{"version": "1.2.3"}'
const versionContentPreBuild = '{"version": "1.2.3-pre.1+qa.1"}'

afterEach(() => {
  fsMock.restore()
})

describe('VersionBump class', () => {
  it('should bump the patch level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    const vb = new VersionBump({
      strategyOptions: {
        bump: 'patch'
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.4'
    })
  })

  it('should bump the patch level version 2', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    const vb = new VersionBump({
      strategyOptions: {
        bump: 'patch'
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.4'
    })
  })

  it('should bump the patch level version 3', async () => {
    fsMock({
      'package.json': versionContentPreBuild
    })

    const vb = new VersionBump({
      strategyOptions: {
        bump: 'patch'
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.4'
    })
  })

  it('should bump the lowest level version', async () => {
    fsMock({
      'package.json': versionContentPreBuild
    })

    const vb = new VersionBump({}, { logger: logger })
    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.3-pre.1+qa.2'
    })
  })

  it('should bump the minor level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    const vb = new VersionBump({
      strategyOptions: {
        bump: 'minor'
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.3.0'
    })
  })

  it('should bump the patch level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    const vb = new VersionBump({
      strategyOptions: {
        bump: 'patch'
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.4'
    })
  })

  it('should bump the pre level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    const vb = new VersionBump({
      strategyOptions: {
        bump: 'pre-release'
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.3-0'
    })
  })

  it('should bump the pre level version 2', async () => {
    fsMock({
      'package.json': versionContentPreBuild
    })

    const vb = new VersionBump({
      strategyOptions: {
        bump: 'pre-release'
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.3-pre.2+qa.1'
    })
  })

  it('should bump the build level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    const vb = new VersionBump({
      strategyOptions: {
        bump: 'build-release'
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.3+0'
    })
  })

  it('should use the onBeforeRelease hook', async () => {
    fsMock({
      'package.json': versionContentPreBuild
    })

    const vb = new VersionBump({
      onBeforeRelease: (versionData) => {
        versionData.build = ['test', 1]
        return versionData
      }
    }, { logger: logger })

    await vb.init({ Strategy: CliBumpStrategy })
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json', { logger })

    expect(data).toEqual({
      version: '1.2.3-pre.1+test.1'
    })
  })
})
