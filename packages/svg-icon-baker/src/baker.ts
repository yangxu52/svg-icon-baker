import { optimize } from 'svgo'
import type { BakeResult, BakeSource, Options, SvgoConfig, SvgoOutput } from './types.ts'

export async function bakeIcon(source: BakeSource, options?: Options): Promise<BakeResult> {
  // validate source
  if (!source || !source.name || !source.content) {
    throw new TypeError('name and content are required')
  }
  const mergedOptions = mergeUserOptions(options)
  try {
    const symbol = convertToSymbol(source, mergedOptions)
    return {
      name: source.name,
      success: true,
      symbol,
    }
  } catch (err) {
    return {
      name: source.name,
      symbol: '',
      success: false,
      error: err + '',
    }
  }
}

function convertToSymbol(source: BakeSource, mergedOptions: Required<Options>): string {
  const svgoConfig = createSvgoConfig(mergedOptions, source.name)
  let result: SvgoOutput
  try {
    result = optimize(source.content, svgoConfig) as SvgoOutput
  } catch (err) {
    throw new Error(`SVGO optimization failed: ${String(err)}`)
  }
  const optimized = result && result.data ? result.data.trim() : ''
  const viewBox = optimized.match(/viewBox="([^"]+)"/)?.[1]
  if (!viewBox) {
    throw new Error('Cannot determine viewBox for SVG. Provide an SVG with viewBox or width/height attributes.')
  }
  return optimized
    .replace(/^\s*<\?xml[^>]*\?>\s*/i, '')
    .replace(/^\s*<svg\b[^>]*>/i, `<symbol id="${source.name}" viewBox="${viewBox}">`)
    .replace(/<\/svg>\s*$/i, '</symbol>')
    .trim()
}

function mergeUserOptions(userOption?: Options): Required<Options> {
  const defaultOptions = {
    defaultPreset: true,
    convertOneStopGradients: false,
    convertStyleToAttrs: false,
    reusePaths: false,
    removeScripts: false,
    removeTitle: true,
    removeXMLNS: true,
    removeXlink: true,
  }
  return { ...defaultOptions, ...(userOption || {}) }
}

function createSvgoConfig(options: Required<Options>, prefix: string): SvgoConfig {
  const plugins: SvgoConfig['plugins'] = []
  if (options.defaultPreset) plugins.push({ name: 'preset-default' })
  if (options.convertOneStopGradients) plugins.push({ name: 'convertOneStopGradients' })
  if (options.convertStyleToAttrs) plugins.push({ name: 'convertStyleToAttrs' })
  if (options.reusePaths) plugins.push({ name: 'reusePaths' })
  if (options.removeScripts) plugins.push({ name: 'removeScripts' })
  if (options.removeTitle) plugins.push({ name: 'removeTitle' })
  if (options.removeXMLNS) plugins.push({ name: 'removeXMLNS' })
  if (options.removeXlink) plugins.push({ name: 'removeXlink' })
  // require view-box, remove width/height
  plugins.push({ name: 'removeDimensions' })
  // require unique id
  plugins.push({ name: 'prefixIds', params: { prefix: `${prefix}-`, delim: '' } })
  return { plugins }
}
