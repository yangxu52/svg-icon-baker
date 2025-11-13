import { describe, expect, test } from 'vitest'
import { bakeIcon } from '../baker.ts'

describe('feature tests', () => {
  describe('complete structure ', () => {
    const svg = `<svg width="32px" height="16px" viewBox="0 0 32 16"><rect id="r" width="32" height="16"/></svg>`
    const result = bakeIcon({ name: 'icon-test', content: svg })
    test('complete symbol start tag', () => {
      expect(result.symbol).toContain('<symbol id="icon-test" viewBox="0 0 32 16">')
    })
    test('complete symbol end tag', () => {
      expect(result.symbol).toContain('</symbol>')
    })
  })
  describe('prefix ids and references', () => {
    const svg = `<svg viewBox="0 0 24 24"><defs><linearGradient id="grad1"><stop offset="0" /></linearGradient>
</defs><rect fill="url(#grad1)" x="0" y="0" width="24" height="24"/></svg>`
    const result = bakeIcon({ name: 'icon-test', content: svg })
    test('rename symbol id', () => {
      expect(result.symbol).toContain('id="icon-test"')
    })
    test('prefix internal id', () => {
      expect(result.symbol).toMatch(/\bid="icon-test-[^"]*"/)
    })
    test('prefix url reference', () => {
      expect(result.symbol).toMatch(/\burl\(#icon-test-[^"]*\)/)
    })
  })
  describe('infers viewBox from width/height and removes width/height', () => {
    const svg = `<svg width="32px" height="16px"><rect id="r" width="32" height="16"/></svg>`
    const result = bakeIcon({ name: 'icon-test', content: svg })
    test('infers viewBox from width/height', () => {
      expect(result.symbol).toContain('viewBox="0 0 32 16"')
    })
    test('not contain width/height attributes', () => {
      expect(result.symbol).not.toContain('width="')
      expect(result.symbol).not.toContain('height="')
    })
  })
  describe('removes xml declaration', () => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="16px" viewBox="0 0 32 16"><rect id="r" width="32" height="16"/></svg>`
    const result = bakeIcon({ name: 'icon-test', content: svg })
    test('not contain xml declaration', () => {
      expect(result.symbol).not.toContain('<?xml')
    })
    test('not contain xmlns attribute', () => {
      expect(result.symbol).not.toContain('xmlns="http://www.w3.org/2000/svg"')
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
