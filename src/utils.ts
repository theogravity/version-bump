import { readFile, writeFile } from 'fs'
import util from 'util'
import { join } from 'path'
import { IVersionBump } from './interfaces'
import VersionStrategyInternalOptions = IVersionBump.VersionStrategyInternalOptions

const writeFileAsync = util.promisify(writeFile)
const readFileAsync = util.promisify(readFile)

const debug = require('debug')('utils')

/**
 * This is mainly used for parsing options, since each config parameter can be
 * either a string or function.
 * - If a value is a function, execute and return it.
 * - If a value is text, return it
 * @param {function|string} value
 * @param {object} [options] Options to feed into the value, if it is a function
 * @returns {Promise<*>}
 */
export async function getValue (value, options = {}) {
  if (typeof value === 'function') {
    return value(options)
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return value
  }

  debug('getValue(): Value was not a string or function: ', value)
}

/**
 * Gets the raw file data
 * @param {string} filePath Full path of the file to read
 * @return {Promise<string>} Contents of the file
 */
export async function getFileContents (filePath) {
  if (!filePath) {
    throw new Error('_getFileContents() requires the file name.')
  }

  let fileContents = null

  try {
    fileContents = await readFileAsync(filePath, 'utf8')
  } catch (e) {
    debug(e)
    throw new Error(`Unable to read file at: ${filePath}`)
  }

  return fileContents
}

export async function writeVersionFile (projectRoot, versionFile, data) {
  const versionFilePath = join(projectRoot, versionFile)

  try {
    await writeFileAsync(versionFilePath, data)
  } catch (e) {
    debug(e)
    throw new Error(`Unable to write the versionFile at: ${versionFilePath}`)
  }
}

export async function readVersionFile (
  projectRoot: string,
  versionFile: string,
  internalOpts: VersionStrategyInternalOptions
) {
  let logger = internalOpts?.logger ?? console

  const versionFilePath = join(projectRoot, versionFile)

  logger.info(`Reading version file: ${versionFilePath}`)

  let data = await getFileContents(versionFilePath)

  try {
    data = JSON.parse(data)
  } catch (e) {
    debug(e)
    throw new Error('Unable to JSON parse the package file data')
  }

  if (!data.version) {
    throw new Error('The JSON data did not contain a "version" field.')
  }

  return data
}

/**
 * Goes through each parameter and resolves the config value, if required.
 * @param {object} options
 * @returns {Promise<object>} Object with resolved values.
 * @private
 */
export async function parseOptions (options, skipOver = {}) {
  if (typeof options !== 'object') {
    return {}
  }

  // Have to use for...in because .map does not support
  // await/async
  for (let name in options) {
    const value = options[name]

    // Don't resolve the value if the property is in
    // the skip definitions
    if (skipOver[name]) {
      continue
    }

    options[name] = await getValue(value)
  }

  return options
}
