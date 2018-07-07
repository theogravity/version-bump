/* eslint-env jest */

import { getLastCommit } from 'git-last-commit'
import fsMock from 'mock-fs'
import VersionBump from '../VersionBump'
import { readVersionFile } from '../utils'

jest.mock('git-last-commit', function () {
  return {
    getLastCommit: jest.fn()
  }
})

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

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '')
    })

    const vb = new VersionBump()
    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.2.4'
    })
  })

  it('should bump the patch level version 2', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, 'Commit message - [patch]')
    })

    const vb = new VersionBump()
    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.2.4'
    })
  })

  it('should bump the patch level version 3', async () => {
    fsMock({
      'package.json': versionContentPreBuild
    })

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '[patch]')
    })

    const vb = new VersionBump()
    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.2.4'
    })
  })

  it('should bump the lowest level version', async () => {
    fsMock({
      'package.json': versionContentPreBuild
    })

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, '')
    })

    const vb = new VersionBump()
    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.2.3-pre.1+qa.2'
    })
  })

  it('should bump the minor level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, 'Commit message - [minor]')
    })

    const vb = new VersionBump()
    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.3.0'
    })
  })

  it('should bump the patch level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, 'Commit message - [patch]')
    })

    const vb = new VersionBump()
    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.2.4'
    })
  })

  it('should bump the pre level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, 'Commit message - [pre-bump]')
    })

    const vb = new VersionBump()
    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.2.3-1'
    })
  })

  it('should bump the build level version', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, 'Commit message - [build-bump]')
    })

    const vb = new VersionBump()
    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.2.3+1'
    })
  })

  it('should use the onBeforeRelease hook', async () => {
    fsMock({
      'package.json': defaultVersionContent
    })

    getLastCommit.mockImplementationOnce((cb) => {
      cb(null, 'Commit message - [pre-bump]')
    })

    const vb = new VersionBump({
      onBeforeRelease: (versionData) => {
        versionData.build = ['test', 1]
        return versionData
      }
    })

    await vb.init()
    await vb.bumpVersion()
    const data = await readVersionFile(process.cwd(), 'package.json')

    expect(data).toEqual({
      version: '1.2.3-1+test.1'
    })
  })
})
