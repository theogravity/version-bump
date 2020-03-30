import { Argv } from 'yargs'

export namespace IVersionBump {
  export interface BaseVersionStrategyOptions {
    /**
     * The project root where the package.json file
     * is found. Default is process.cwd().
     */
    projectRoot?: string
    /**
     * Name of the version bump config file, relative to projectRoot.
     * Default is '.version-bump.ts'
     */
    configFile?: string
    /**
     * Name of the file where the version bump is performed. The file must
     * be JSON with a "version" property. Default is 'package.json'
     */
    versionFile?: string

    /**
     * This is called after the version has been incremented
     * and before the version data is to be converted to a string and saved
     * to the version file
     * Use the opportunity to do any custom-work to the version data
     * eg add a pre-release string, or build string
     */
    onBeforeRelease?: (versionData: ParsedSemVerResult) => ParsedSemVerResult

    [key: string]: any
  }

  export interface ConfigParserOptions extends BaseVersionStrategyOptions {
    /**
     * Name of the versioning strategy to use. Default is 'cli'
     */
    strategy?: string
  }

  export interface CommandConfig<Args = {}> {
    /**
     * Command name
     */
    command: string
    /**
     * Command description
     */
    describe: string

    /**
     * This function takes in the yargs instance allowing you to call additional functions
     * if necessary for your command
     */
    builder?: (yargs: Argv<Args>) => void

    /**
     * Do not define this method - used internally
     */
    handler?: any
  }

  export interface CombinedConfigOptions extends ConfigParserOptions {
    /**
     * True if a config file was used.
     */
    _usingConfigFile?: boolean

    [key: string]: any
  }

  export interface ILogger extends Partial<Console> {}

  /**
   * @see https://www.npmjs.com/package/semver-parser#parsesemverversion-strict
   */
  export interface ParsedSemVerResult {
    /**
     * given version string
     */
    version: string
    /**
     * matches SemVer format?
     */
    matches: boolean
    /**
     * major version
     */
    major: number | undefined
    minor: number | undefined
    patch: number | undefined
    /**
     * pre release version in array
     */
    pre: Array<string | number> | undefined
    /**
     * build ID in array
     */
    build: Array<string | number> | undefined
  }

  export interface VersionStrategyInternalOptions {
    logger: ILogger
  }

  /**
   * Represents a class definition that extends BaseVersionStrategy
   */
  export interface StrategyPlugin {
    /**
     * Short identifier for the strategy
     */
    strategyShortName: string

    /**
     * Class name
     */
    name: string

    getCommandConfig: (yargs) => CommandConfig
  }

  export interface VersionFile {
    version: string

    [key: string]: any
  }
}
