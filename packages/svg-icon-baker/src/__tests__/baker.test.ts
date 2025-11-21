import { describe, expect, test } from 'vitest'
import { bakeIcon } from '../baker.ts'

describe('feature tests', () => {
  const svg = `\uFEFF<?xml version="1.0" encoding="UTF-8"?>
                 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="16px">
                   <defs>
                     <clipPath id="clipA"><rect x="0" y="0" width="24" height="12"/></clipPath>
                     <mask id="maskA"><rect x="0" y="0" width="24" height="24" fill="#fff"/></mask>
                     <filter id="filterA"><feGaussianBlur stdDeviation="2"/></filter>
                     <pattern id="patternA" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4"/></pattern>
                     <marker id="markerA" markerWidth="4" markerHeight="4"><path d="M0,0 L4,2 L0,4 z"/></marker><path id="p1" d="M0 0L24 0"/>
                     <linearGradient id="grad1"><stop offset="0"/></linearGradient>
                   </defs>
                   <rect fill="url(#grad1)" x="0" y="0" width="24" height="24"/>
                   <rect clip-path="url(#clipA)" x="0" y="0" width="24" height="24"/>
                   <rect mask="url(#maskA)" x="0" y="0" width="24" height="24"/>
                   <rect filter="url(#filterA)" x="0" y="0" width="24" height="24"/>
                   <rect fill="url(#patternA)" x="0" y="0" width="24" height="24"/>
                   <path d="M0 12L24 12" marker-start="url(#markerA)" marker-end="url(#markerA)"/>
                   <use href="#p" x="0" y="0"/>
                   <use xlink:href="#p" x="0" y="2"/>
                 </svg>`
  const result = bakeIcon({ name: 'icon-test', content: svg })
  describe('complete structure ', () => {
    test('complete symbol start tag', () => {
      expect(result.symbol.startsWith('<symbol')).toBe(true)
    })
    test('complete symbol end tag', () => {
      expect(result.symbol.endsWith('</symbol>')).toBe(true)
    })
  })
  describe('prefix ids and references', () => {
    test('rename symbol id', () => {
      expect(result.symbol).toContain('id="icon-test"')
    })
    test('prefix internal id', () => {
      expect(result.symbol).toMatch(/\bid="icon-test-[^"]*"/)
    })
    test('prefix url reference', () => {
      expect(result.symbol).toMatch(/\burl\(#icon-test-[^"]*\)/)
      expect(result.symbol).not.toMatch(/\burl\(#(?!icon-test-)[^")]*\)/)
    })
    test('use href instead of xlink:href and it is prefixed', () => {
      expect(result.symbol).toMatch(/href="#icon-test-[^"]+"/)
      expect(result.symbol).not.toMatch(/xlink:href="#icon-test-[^"]+"/)
    })
  })
  describe('infers viewBox from width/height and removes width/height', () => {
    test('infers viewBox from width/height', () => {
      expect(result.symbol).toContain('viewBox="0 0 32 16"')
    })
    test('not contain width/height attributes', () => {
      expect(result.symbol).not.toContain('width="32px"')
      expect(result.symbol).not.toContain('height="16px"')
    })
  })
  describe('removes xml/comment declaration', () => {
    test('not contain BOM', () => {
      expect(result.symbol).not.toContain('\uFEFF')
    })
    test('not contain xml declaration', () => {
      expect(result.symbol).not.toContain('<?xml')
    })
    test('not contain comment', () => {
      expect(result.symbol).not.toContain('<!--')
    })
  })
})

describe('validation tests', () => {
  test('name is required', () => {
    const testFn = () => bakeIcon({ content: '<svg></svg>' } as never)
    expect(testFn).toThrow('Property name and content are required.')
  })
  test('content is required', () => {
    const testFn = () => bakeIcon({ name: 'icon-test' } as never)
    expect(testFn).toThrow('Property name and content are required.')
  })
  test('invalid name', () => {
    const testFn = () => bakeIcon({ name: '1 bad name', content: '<svg viewBox="0 0 1 1"/>' })
    expect(testFn).toThrow(/Invalid name/)
  })
  test('svgo parsing failed', () => {
    const testFn = () => bakeIcon({ name: 'icon-test', content: `<div></vid>` })
    expect(testFn).toThrow('Parsing failed.')
  })
  test('viewBox cannot be determined', () => {
    const svg = `<svg><rect height="16" width="32" /></svg>`
    const testFn = () => bakeIcon({ name: 'icon-test', content: svg })
    expect(testFn).toThrow('Cannot determine viewBox.')
  })
})

describe('custom options', () => {
  test('opposite of default preset', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16"><title>test</title><rect id="r" width="32" height="16"/></svg>`
    const testFn = () =>
      bakeIcon(
        { name: 'icon-test', content: svg },
        {
          defaultPreset: false,
          convertOneStopGradients: true,
          convertStyleToAttrs: true,
          reusePaths: true,
          removeScripts: true,
          removeTitle: false,
          removeXMLNS: false,
          removeXlink: false,
        }
      )
    expect(testFn).not.toThrow('Error')
  })
})
