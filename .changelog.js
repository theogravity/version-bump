// This is an optional configuration file
// you can use with changelog-version.
// If specified, any command line args has priority over the
// values returned in this file.

// All values are optional.
// Do not use the ES6 export default
// since the file is imported using require()
// See command line options for additional available properties
module.exports = {
    /**
     * This is called before doing the version stamping.
     * @returns {Promise<void>}
     */
    onBeforeRelease: async () => {},
    /**
     * This is called after the version stamping is complete.
     * @param {string} version Release version that the changelog stamp used
     * @param {string} date Formatted date that the changelog stamp used
     * @param {string} releaseStamp Release text that the changelog was stamped with
     * @returns {Promise<void>}
     */
    onAfterRelease: async ({ version, date, releaseStamp } = {}) => {},

    // Values can either be text
    // or a (async) function that returns text

    // ==== Common options ====
    // If specified here, this will have priority
    // over the command line option projectRoot
    // once this file is read.
    projectRoot: () => {
        return process.cwd()
    },
    changelogFile: () => {
        return 'CHANGELOG.md'
    },
    // ==== Options specific to prepare ====
    newUnreleasedText: '# UNRELEASED\n\n',

    // ==== Options specific to release ====
    packageFile: async () => {
        return 'package.json'
    },
    // see https://www.npmjs.com/package/dateformat
    // for options
    dateFormat: 'default',
    unreleasedTag: () => {
        return 'UNRELEASED'
    },
    unreleasedTagFormat: '{version} - {date}',
    requireUnreleasedEntry: true,
    requireUnreleasedEntryFailMsg: `You cannot commit until you've added the release notes to CHANGELOG.md
  
See CONTRIBUTING.md for instructions.`
}
