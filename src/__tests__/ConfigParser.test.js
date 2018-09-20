/* eslint-env jest */

import ConfigParser from '../ConfigParser'
import { resolve } from 'path'

describe('ConfigParser class', () => {
  it('it should return the original config if no file is used', async () => {
    const configParser = new ConfigParser({
      versionFile: 'package.json',
      configFile: 'does-not-exist'
    })

    const options = await configParser.parseConfig()

    expect(options).toEqual({
      versionFile: 'package.json',
      configFile: 'does-not-exist',
      projectRoot: process.cwd()
    })
  })

  it('should parse custom config', async () => {
    const root = resolve(__dirname, '..')

    const configParser = new ConfigParser({
      projectRoot: root,
      configFile: '__fixtures__/config-example.js'
    })

    const options = await configParser.parseConfig()

    expect(options).toEqual({
      bump: 'minor',
      configFile: '__fixtures__/config-example.js',
      projectRoot: process.cwd(),
      strategy: 'cli',
      versionFile: 'test.json',
      _usingConfig: true
    })
  })
})
