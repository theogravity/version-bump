/* eslint-env jest */
import execa from 'execa'
import { writeFile } from 'fs'
import util from 'util'
import { join } from 'path'

const defaultVersionContent = '{"version": "1.2.3"}'
const writeFileAsync = util.promisify(writeFile)
const TEST_VERSION_FILE = 'version.test.json'
const TEST_CONFIG_FILE = 'version-config-test.js'

let defaultArgs = null

beforeEach(async () => {
  defaultArgs = [
    '--require',
    '@babel/register',
    './src/bin/version-bump.js',
    '---versionFile',
    TEST_VERSION_FILE,
    '--configFile',
    'abcd'
  ]
  await writeFileAsync(
    join(process.cwd(), TEST_VERSION_FILE),
    defaultVersionContent
  )
})

describe('version-bump', () => {
  it('should show help', async () => {
    try {
      // have to use shellSync for this one
      // because the default throws an error
      execa.shellSync('node', defaultArgs)
    } catch (e) {
      expect(e).toContain('version-bump <strategy>')
    }
  })

  it('should show help for an invalid command', async () => {
    defaultArgs.push('invalid-command')

    try {
      execa.shellSync('node', defaultArgs)
    } catch (e) {
      expect(e).toContain('version-bump <strategy>')
    }
  })

  it('should show help for cli', async () => {
    defaultArgs.push('cli')
    defaultArgs.push('--help')
    const { stdout } = await execa('node', defaultArgs)

    expect(stdout).toContain('version-bump.js cli [bump]')
    expect(stdout).toContain('Version type to bump.')
  })

  it('should show current version', async () => {
    defaultArgs.push('show-version')
    const { stdout } = await execa('node', defaultArgs)

    expect(stdout).toContain('1.2.3')
  })

  it('should bump version', async () => {
    defaultArgs.push('cli')
    const { stdout } = await execa('node', defaultArgs)

    expect(stdout).toContain('New version: 1.2.4')
  })

  it('should bump version using config file', async () => {
    await writeFileAsync(
      join(process.cwd(), TEST_CONFIG_FILE),
      `
        module.exports = {
          strategy: 'cli'
        }
      `
    )

    defaultArgs.pop()
    defaultArgs.push(TEST_CONFIG_FILE)

    const { stdout } = await execa('node', defaultArgs)

    expect(stdout).toContain('Using config file')
    expect(stdout).toContain(TEST_CONFIG_FILE)
    expect(stdout).toContain('New version: 1.2.4')
  })

  describe('plugin / strategy support', () => {
    it('should show help', async () => {
      defaultArgs.push('dummy')
      defaultArgs.push('--help')
      const { stdout } = await execa('node', defaultArgs)

      expect(stdout).toContain('version-bump.js dummy')
      expect(stdout).toContain('An option that does nothing')
    })

    it('should bump version', async () => {
      defaultArgs.push('dummy')
      const { stdout } = await execa('node', defaultArgs)

      // just in case a commit message contains a version bump tag
      expect(stdout).not.toContain('An option that does nothing')
      expect(stdout).toContain('New version: 1.2.4')
    })

    it('should use a custom config file', async () => {
      await writeFileAsync(
        join(process.cwd(), TEST_CONFIG_FILE),
        `
        module.exports = {
          strategy: 'dummy'
        }
      `
      )

      defaultArgs.pop()
      defaultArgs.push(TEST_CONFIG_FILE)

      const { stdout } = await execa('node', defaultArgs)

      expect(stdout).toContain('Using config file')
      expect(stdout).toContain(TEST_CONFIG_FILE)
      expect(stdout).toContain('New version: 1.2.4')
    })
  })
})
