/* eslint-env jest */

import { bumpArray, bumpVersionData, versionObjToString } from '../version-utils'
import { BUMP_LEVEL } from '../consts'
import { parseSemVer } from 'semver-parser'

describe('version-utils', () => {
  describe('bumpVersionData', () => {
    it('should bump major level', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
        'build': undefined,
        'major': 2,
        'matches': true,
        'minor': 0,
        'patch': 0,
        'pre': undefined,
        'version': '2.0.0'
      })
    })

    it('should bump minor level', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 3,
        'patch': 0,
        'pre': undefined,
        'version': '1.3.0'
      })
    })

    it('should bump patch level', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 4,
        'pre': undefined,
        'version': '1.2.4'
      })
    })

    it('should bump pre-major level', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
        'build': undefined,
        'major': 2,
        'matches': true,
        'minor': 0,
        'patch': 0,
        'pre': [0],
        'version': '2.0.0-0'
      })
    })

    it('should bump pre-minor level', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 3,
        'patch': 0,
        'pre': [0],
        'version': '1.3.0-0'
      })
    })

    it('should bump pre-patch level', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 4,
        'pre': [0],
        'version': '1.2.4-0'
      })
    })

    it('should bump pre-release level', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 4,
        'pre': [0],
        'version': '1.2.4-0'
      })
    })

    it('should bump build-release level', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
        'build': [0],
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 3,
        'pre': undefined,
        'version': '1.2.3+0'
      })
    })

    it('should bump lowest level - patch', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.LOWEST)).toEqual({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 4,
        'pre': undefined,
        'version': '1.2.4'
      })
    })

    it('should bump lowest level - pre', () => {
      const verData = parseSemVer('1.2.3-0')
      expect(bumpVersionData(verData, BUMP_LEVEL.LOWEST)).toEqual({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 3,
        'pre': [1],
        'version': '1.2.3-1'
      })
    })

    it('should bump lowest level - build', () => {
      const verData = parseSemVer('1.2.3+0')
      expect(bumpVersionData(verData, BUMP_LEVEL.LOWEST)).toEqual({
        'build': [1],
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 3,
        'pre': undefined,
        'version': '1.2.3+1'
      })
    })
  })

  describe('versionObjToString', () => {
    it('should convert a simple version obj to string', () => {
      expect(versionObjToString({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 4,
        'pre': undefined
      })).toBe('1.2.4')
    })

    it('should convert a complex version obj to string', () => {
      expect(versionObjToString({
        'build': undefined,
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 4,
        'pre': ['alpha', 0]
      })).toBe('1.2.4-alpha.0')
    })

    it('should convert a complex version obj to string 2', () => {
      expect(versionObjToString({
        'build': ['alpha', 0],
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 4,
        'pre': undefined
      })).toBe('1.2.4+alpha.0')
    })

    it('should convert a complex version obj to string 3', () => {
      expect(versionObjToString({
        'build': ['beta', 0],
        'major': 1,
        'matches': true,
        'minor': 2,
        'patch': 4,
        'pre': ['alpha', 0]
      })).toBe('1.2.4-alpha.0+beta.0')
    })
  })

  describe('bumpArray', () => {
    it('should create an initial value if the array is empty', () => {
      expect(bumpArray()).toEqual([0])
    })

    it('should bump the value if it is only an integer', () => {
      expect(bumpArray([0])).toEqual([1])
    })

    it('should bump the value if it is only a string', () => {
      expect(bumpArray(['alpha'])).toEqual(['alpha', 0])
    })

    it('should bump an integer mixed with strings', () => {
      expect(bumpArray(['alpha', 0, 'beta'])).toEqual(['alpha', 1, 'beta'])
    })
  })
})
