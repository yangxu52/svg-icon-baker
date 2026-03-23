import { optimize } from 'svgo'
import type { BakeResult, BakeSource, ManualOptions, Options, SvgoOutput, SvgoPlugins } from './types.ts'

export function bakeIcon(source: BakeSource, options?: Options): BakeResult {
  const inferredOptions = inferOptions(options)
  const svgoPlugins = createSvgoPlugins(inferredOptions)
  return {
    name: source.name,
    content: convertToSymbol(source, svgoPlugins),
  }
}

export function bakeIcons(sources: BakeSource[], options?: Options): BakeResult[] {
  const inferredOptions = inferOptions(options)
  const svgoPlugins = createSvgoPlugins(inferredOptions)
  return sources.map((source) => ({
    name: source.name,
    content: convertToSymbol(source, svgoPlugins),
  }))
}

function convertToSymbol(source: BakeSource, plugins: SvgoPlugins): string {
  // validate source
  if (!source || !source.name || !source.content) {
    throw new TypeError('Property name and content are required.')
  }
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(source.name)) {
    throw new TypeError('Invalid name. Use letters, numbers, dash, or underscore, starting with a letter.')
  }
  // add require unique id
  plugins.push({ name: 'prefixIds', params: { prefix: `${source.name}-`, delim: '' } })
  let result: SvgoOutput
  try {
    result = optimize(source.content, { plugins })
  } catch (err) {
    throw new Error(`Parsing failed. ${String(err)}`)
  }
  const viewBox = result.data.match(/viewBox="([^"]+)"/)?.[1]
  if (!viewBox) {
    throw new Error('Cannot determine viewBox. Provide an SVG with viewBox or width/height attributes.')
  }
  const cleanedSvg = result.data.replace(/^\s*<\?xml[^>]*\?>\s*/i, '')
  return toSymbolRootTag(cleanedSvg, source.name, viewBox)
}

function toSymbolRootTag(svg: string, symbolId: string, viewBox: string): string {
  const rootOpenTag = svg.match(/^\s*<svg\b[^>]*>/i)![0]
  const preservedAttrs = rootOpenTag
    .replace(/^\s*<svg\b/i, '')
    .replace(/>\s*$/i, '')
    .replace(/\s+id=(['"])[^'"]*\1/gi, '')
    .replace(/\s+viewBox=(['"])[^'"]*\1/gi, '')
    .replace(/\s+width=(['"])[^'"]*\1/gi, '')
    .replace(/\s+height=(['"])[^'"]*\1/gi, '')
    .trim()
  const attrs = preservedAttrs ? ` ${preservedAttrs}` : ''
  const symbolOpenTag = `<symbol id="${symbolId}" viewBox="${viewBox}"${attrs}>`
  return svg
    .replace(/^\s*<svg\b[^>]*>/i, symbolOpenTag)
    .replace(/<\/svg>\s*$/i, '</symbol>')
    .trim()
}

function inferOptions(userOption?: Options): Required<ManualOptions> {
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
  if (typeof userOption === 'boolean') {
    return userOption
      ? defaultOptions
      : {
          defaultPreset: false,
          convertOneStopGradients: false,
          convertStyleToAttrs: false,
          reusePaths: false,
          removeScripts: false,
          removeTitle: false,
          removeXMLNS: false,
          removeXlink: false,
        }
  }
  return { ...defaultOptions, ...(userOption || {}) }
}

function createSvgoPlugins(options: Required<ManualOptions>): SvgoPlugins {
  const plugins: SvgoPlugins = []
  if (options.defaultPreset)
    plugins.push({
      name: 'preset-default',
      params: {
        overrides: {
          // cleanupIds: false,
          removeUselessDefs: false,
          removeHiddenElems: false,
          removeUnknownsAndDefaults: false,
          collapseGroups: false,
          mergePaths: false,
          convertShapeToPath: false,
        },
      },
    })
  // Keep optional plugins only if they exist in SVGO v4
  if (options.convertOneStopGradients) plugins.push({ name: 'convertOneStopGradients' })
  if (options.convertStyleToAttrs) plugins.push({ name: 'convertStyleToAttrs' })
  if (options.reusePaths) plugins.push({ name: 'reusePaths' })
  if (options.removeScripts) plugins.push({ name: 'removeScripts' })
  if (options.removeTitle) plugins.push({ name: 'removeTitle' })
  if (options.removeXMLNS) plugins.push({ name: 'removeXMLNS' })
  if (options.removeXlink) plugins.push({ name: 'removeXlink' })
  // add require view-box, remove width/height
  plugins.push({ name: 'removeDimensions' })
  return plugins
}
