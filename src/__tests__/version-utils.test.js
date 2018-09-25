/* eslint-env jest */

import {
  bumpArray,
  bumpVersionData,
  versionObjToString
} from '../version-utils'
import { BUMP_LEVEL } from '../consts'
import { parseSemVer } from 'semver-parser'

const MAJOR_VER_STR = '1.0.0'
const MINOR_VER_STR = '2.1.0'
const PATCH_VER_STR = '3.2.1'
const PRE_VER_STR = '4.0.0-0'
const BUILD_VER_STR = '5.0.0+0'
const PRE_TAG_VER_STR = '6.0.0-pre.0'
const BUILD_TAG_VER_STR = '7.0.0+build.0'
const PRE_BUILD_TAG_VER_STR = '8.0.0-pre.0+build.0'

describe('version-utils', () => {
  describe('bumpVersionData', () => {
    describe('major levels', () => {
      it(`should bump ${MAJOR_VER_STR}`, () => {
        const verData = parseSemVer(MAJOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
          build: undefined,
          major: 2,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '2.0.0'
        })
      })

      it(`should bump ${MINOR_VER_STR}`, () => {
        const verData = parseSemVer(MINOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
          build: undefined,
          major: 3,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '3.0.0'
        })
      })

      it(`should bump ${PATCH_VER_STR}`, () => {
        const verData = parseSemVer(PATCH_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
          build: undefined,
          major: 4,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '4.0.0'
        })
      })

      it(`should bump ${PRE_VER_STR}`, () => {
        const verData = parseSemVer(PRE_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
          build: undefined,
          major: 4,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '4.0.0'
        })
      })

      it(`should bump ${BUILD_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
          build: undefined,
          major: 6,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '6.0.0'
        })
      })

      it(`should bump ${PRE_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
          build: undefined,
          major: 6,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '6.0.0'
        })
      })

      it(`should bump ${BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
          build: undefined,
          major: 8,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '8.0.0'
        })
      })

      it(`should bump ${PRE_BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MAJOR)).toEqual({
          build: undefined,
          major: 8,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '8.0.0'
        })
      })
    })

    describe('minor levels', () => {
      it(`should bump ${MAJOR_VER_STR}`, () => {
        const verData = parseSemVer(MAJOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
          build: undefined,
          major: 1,
          matches: true,
          minor: 1,
          patch: 0,
          pre: undefined,
          version: '1.1.0'
        })
      })

      it(`should bump ${MINOR_VER_STR}`, () => {
        const verData = parseSemVer(MINOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
          build: undefined,
          major: 2,
          matches: true,
          minor: 2,
          patch: 0,
          pre: undefined,
          version: '2.2.0'
        })
      })

      it(`should bump ${PATCH_VER_STR}`, () => {
        const verData = parseSemVer(PATCH_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
          build: undefined,
          major: 3,
          matches: true,
          minor: 3,
          patch: 0,
          pre: undefined,
          version: '3.3.0'
        })
      })

      it(`should bump ${PRE_VER_STR}`, () => {
        const verData = parseSemVer(PRE_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
          build: undefined,
          major: 4,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '4.0.0'
        })
      })

      it(`should bump ${BUILD_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
          build: undefined,
          major: 5,
          matches: true,
          minor: 1,
          patch: 0,
          pre: undefined,
          version: '5.1.0'
        })
      })

      it(`should bump ${PRE_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
          build: undefined,
          major: 6,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '6.0.0'
        })
      })

      it(`should bump ${BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
          build: undefined,
          major: 7,
          matches: true,
          minor: 1,
          patch: 0,
          pre: undefined,
          version: '7.1.0'
        })
      })

      it(`should bump ${PRE_BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.MINOR)).toEqual({
          build: undefined,
          major: 8,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '8.0.0'
        })
      })
    })

    describe('patch levels', () => {
      it(`should bump ${MAJOR_VER_STR}`, () => {
        const verData = parseSemVer(MAJOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
          build: undefined,
          major: 1,
          matches: true,
          minor: 0,
          patch: 1,
          pre: undefined,
          version: '1.0.1'
        })
      })

      it(`should bump ${MINOR_VER_STR}`, () => {
        const verData = parseSemVer(MINOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
          build: undefined,
          major: 2,
          matches: true,
          minor: 1,
          patch: 1,
          pre: undefined,
          version: '2.1.1'
        })
      })

      it(`should bump ${PATCH_VER_STR}`, () => {
        const verData = parseSemVer(PATCH_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
          build: undefined,
          major: 3,
          matches: true,
          minor: 2,
          patch: 2,
          pre: undefined,
          version: '3.2.2'
        })
      })

      it(`should bump ${PRE_VER_STR}`, () => {
        const verData = parseSemVer(PRE_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
          build: undefined,
          major: 4,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '4.0.0'
        })
      })

      it(`should bump ${BUILD_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
          build: undefined,
          major: 5,
          matches: true,
          minor: 0,
          patch: 1,
          pre: undefined,
          version: '5.0.1'
        })
      })

      it(`should bump ${PRE_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
          build: undefined,
          major: 6,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '6.0.0'
        })
      })

      it(`should bump ${BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
          build: undefined,
          major: 7,
          matches: true,
          minor: 0,
          patch: 1,
          pre: undefined,
          version: '7.0.1'
        })
      })

      it(`should bump ${PRE_BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PATCH)).toEqual({
          build: undefined,
          major: 8,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '8.0.0'
        })
      })
    })

    describe('pre-major levels', () => {
      it(`should bump ${MAJOR_VER_STR}`, () => {
        const verData = parseSemVer(MAJOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
          build: undefined,
          major: 2,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '2.0.0-0'
        })
      })

      it(`should bump ${MINOR_VER_STR}`, () => {
        const verData = parseSemVer(MINOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
          build: undefined,
          major: 3,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '3.0.0-0'
        })
      })

      it(`should bump ${PATCH_VER_STR}`, () => {
        const verData = parseSemVer(PATCH_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
          build: undefined,
          major: 4,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '4.0.0-0'
        })
      })

      it(`should bump ${PRE_VER_STR}`, () => {
        const verData = parseSemVer(PRE_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
          build: undefined,
          major: 5,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '5.0.0-0'
        })
      })

      it(`should bump ${BUILD_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
          build: undefined,
          major: 6,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '6.0.0-0'
        })
      })

      it(`should bump ${PRE_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
          build: undefined,
          major: 7,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '7.0.0-0'
        })
      })

      it(`should bump ${BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
          build: undefined,
          major: 8,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '8.0.0-0'
        })
      })

      it(`should bump ${PRE_BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MAJOR)).toEqual({
          build: undefined,
          major: 9,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '9.0.0-0'
        })
      })
    })

    describe('pre-minor levels', () => {
      it(`should bump ${MAJOR_VER_STR}`, () => {
        const verData = parseSemVer(MAJOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
          build: undefined,
          major: 1,
          matches: true,
          minor: 1,
          patch: 0,
          pre: [0],
          version: '1.1.0-0'
        })
      })

      it(`should bump ${MINOR_VER_STR}`, () => {
        const verData = parseSemVer(MINOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
          build: undefined,
          major: 2,
          matches: true,
          minor: 2,
          patch: 0,
          pre: [0],
          version: '2.2.0-0'
        })
      })

      it(`should bump ${PATCH_VER_STR}`, () => {
        const verData = parseSemVer(PATCH_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
          build: undefined,
          major: 3,
          matches: true,
          minor: 3,
          patch: 0,
          pre: [0],
          version: '3.3.0-0'
        })
      })

      it(`should bump ${PRE_VER_STR}`, () => {
        const verData = parseSemVer(PRE_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
          build: undefined,
          major: 4,
          matches: true,
          minor: 1,
          patch: 0,
          pre: [0],
          version: '4.1.0-0'
        })
      })

      it(`should bump ${BUILD_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
          build: undefined,
          major: 5,
          matches: true,
          minor: 1,
          patch: 0,
          pre: [0],
          version: '5.1.0-0'
        })
      })

      it(`should bump ${PRE_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
          build: undefined,
          major: 6,
          matches: true,
          minor: 1,
          patch: 0,
          pre: [0],
          version: '6.1.0-0'
        })
      })

      it(`should bump ${BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
          build: undefined,
          major: 7,
          matches: true,
          minor: 1,
          patch: 0,
          pre: [0],
          version: '7.1.0-0'
        })
      })

      it(`should bump ${PRE_BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_MINOR)).toEqual({
          build: undefined,
          major: 8,
          matches: true,
          minor: 1,
          patch: 0,
          pre: [0],
          version: '8.1.0-0'
        })
      })
    })

    describe('pre-patch levels', () => {
      it(`should bump ${MAJOR_VER_STR}`, () => {
        const verData = parseSemVer(MAJOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
          build: undefined,
          major: 1,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '1.0.1-0'
        })
      })

      it(`should bump ${MINOR_VER_STR}`, () => {
        const verData = parseSemVer(MINOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
          build: undefined,
          major: 2,
          matches: true,
          minor: 1,
          patch: 1,
          pre: [0],
          version: '2.1.1-0'
        })
      })

      it(`should bump ${PATCH_VER_STR}`, () => {
        const verData = parseSemVer(PATCH_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
          build: undefined,
          major: 3,
          matches: true,
          minor: 2,
          patch: 2,
          pre: [0],
          version: '3.2.2-0'
        })
      })

      it(`should bump ${PRE_VER_STR}`, () => {
        const verData = parseSemVer(PRE_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
          build: undefined,
          major: 4,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '4.0.1-0'
        })
      })

      it(`should bump ${BUILD_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
          build: undefined,
          major: 5,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '5.0.1-0'
        })
      })

      it(`should bump ${PRE_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
          build: undefined,
          major: 6,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '6.0.1-0'
        })
      })

      it(`should bump ${BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
          build: undefined,
          major: 7,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '7.0.1-0'
        })
      })

      it(`should bump ${PRE_BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_PATCH)).toEqual({
          build: undefined,
          major: 8,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '8.0.1-0'
        })
      })
    })

    describe('pre-release levels', () => {
      it(`should bump ${MAJOR_VER_STR}`, () => {
        const verData = parseSemVer(MAJOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
          build: undefined,
          major: 1,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '1.0.1-0'
        })
      })

      it(`should bump ${MINOR_VER_STR}`, () => {
        const verData = parseSemVer(MINOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
          build: undefined,
          major: 2,
          matches: true,
          minor: 1,
          patch: 1,
          pre: [0],
          version: '2.1.1-0'
        })
      })

      it(`should bump ${PATCH_VER_STR}`, () => {
        const verData = parseSemVer(PATCH_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
          build: undefined,
          major: 3,
          matches: true,
          minor: 2,
          patch: 2,
          pre: [0],
          version: '3.2.2-0'
        })
      })

      it(`should bump ${PRE_VER_STR}`, () => {
        const verData = parseSemVer(PRE_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
          build: undefined,
          major: 4,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [1],
          version: '4.0.0-1'
        })
      })

      it(`should bump ${BUILD_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
          build: undefined,
          major: 5,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '5.0.1-0'
        })
      })

      it(`should bump ${PRE_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
          build: undefined,
          major: 6,
          matches: true,
          minor: 0,
          patch: 0,
          pre: ['pre', 1],
          version: '6.0.0-pre.1'
        })
      })

      it(`should bump ${BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
          build: undefined,
          major: 7,
          matches: true,
          minor: 0,
          patch: 1,
          pre: [0],
          version: '7.0.1-0'
        })
      })

      it(`should bump ${PRE_BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.PRE_RELEASE)).toEqual({
          build: undefined,
          major: 8,
          matches: true,
          minor: 0,
          patch: 0,
          pre: ['pre', 1],
          version: '8.0.0-pre.1'
        })
      })
    })

    describe('build-release levels', () => {
      it(`should bump ${MAJOR_VER_STR}`, () => {
        const verData = parseSemVer(MAJOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
          build: [0],
          major: 1,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '1.0.0+0'
        })
      })

      it(`should bump ${MINOR_VER_STR}`, () => {
        const verData = parseSemVer(MINOR_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
          build: [0],
          major: 2,
          matches: true,
          minor: 1,
          patch: 0,
          pre: undefined,
          version: '2.1.0+0'
        })
      })

      it(`should bump ${PATCH_VER_STR}`, () => {
        const verData = parseSemVer(PATCH_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
          build: [0],
          major: 3,
          matches: true,
          minor: 2,
          patch: 1,
          pre: undefined,
          version: '3.2.1+0'
        })
      })

      it(`should bump ${PRE_VER_STR}`, () => {
        const verData = parseSemVer(PRE_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
          build: [0],
          major: 4,
          matches: true,
          minor: 0,
          patch: 0,
          pre: [0],
          version: '4.0.0-0+0'
        })
      })

      it(`should bump ${BUILD_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
          build: [1],
          major: 5,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '5.0.0+1'
        })
      })

      it(`should bump ${PRE_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
          build: [0],
          major: 6,
          matches: true,
          minor: 0,
          patch: 0,
          pre: ['pre', 0],
          version: '6.0.0-pre.0+0'
        })
      })

      it(`should bump ${BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
          build: ['build', 1],
          major: 7,
          matches: true,
          minor: 0,
          patch: 0,
          pre: undefined,
          version: '7.0.0+build.1'
        })
      })

      it(`should bump ${PRE_BUILD_TAG_VER_STR}`, () => {
        const verData = parseSemVer(PRE_BUILD_TAG_VER_STR)
        expect(bumpVersionData(verData, BUMP_LEVEL.BUILD_RELEASE)).toEqual({
          build: ['build', 1],
          major: 8,
          matches: true,
          minor: 0,
          patch: 0,
          pre: ['pre', 0],
          version: '8.0.0-pre.0+build.1'
        })
      })
    })

    it('should bump lowest level - patch', () => {
      const verData = parseSemVer('1.2.3')
      expect(bumpVersionData(verData, BUMP_LEVEL.LOWEST)).toEqual({
        build: undefined,
        major: 1,
        matches: true,
        minor: 2,
        patch: 4,
        pre: undefined,
        version: '1.2.4'
      })
    })

    it('should bump lowest level - pre', () => {
      const verData = parseSemVer('1.2.3-0')
      expect(bumpVersionData(verData, BUMP_LEVEL.LOWEST)).toEqual({
        build: undefined,
        major: 1,
        matches: true,
        minor: 2,
        patch: 3,
        pre: [1],
        version: '1.2.3-1'
      })
    })

    it('should bump lowest level - build', () => {
      const verData = parseSemVer('1.2.3+0')
      expect(bumpVersionData(verData, BUMP_LEVEL.LOWEST)).toEqual({
        build: [1],
        major: 1,
        matches: true,
        minor: 2,
        patch: 3,
        pre: undefined,
        version: '1.2.3+1'
      })
    })
  })

  describe('versionObjToString', () => {
    it('should convert a simple version obj to string', () => {
      expect(
        versionObjToString({
          build: undefined,
          major: 1,
          matches: true,
          minor: 2,
          patch: 4,
          pre: undefined
        })
      ).toBe('1.2.4')
    })

    it('should convert a complex version obj to string', () => {
      expect(
        versionObjToString({
          build: undefined,
          major: 1,
          matches: true,
          minor: 2,
          patch: 4,
          pre: ['alpha', 0]
        })
      ).toBe('1.2.4-alpha.0')
    })

    it('should convert a complex version obj to string 2', () => {
      expect(
        versionObjToString({
          build: ['alpha', 0],
          major: 1,
          matches: true,
          minor: 2,
          patch: 4,
          pre: undefined
        })
      ).toBe('1.2.4+alpha.0')
    })

    it('should convert a complex version obj to string 3', () => {
      expect(
        versionObjToString({
          build: ['beta', 0],
          major: 1,
          matches: true,
          minor: 2,
          patch: 4,
          pre: ['alpha', 0]
        })
      ).toBe('1.2.4-alpha.0+beta.0')
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
