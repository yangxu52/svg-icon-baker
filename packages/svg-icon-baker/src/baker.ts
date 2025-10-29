import { optimize } from 'svgo'
import type { BakeResult, BakeSource, Options, SvgoConfig, SvgoOutput } from './types.ts'

export async function bakeIcon(source: BakeSource, options?: Options): Promise<BakeResult> {
  // validate source
  if (!source || !source.name || !source.content) {
    throw new TypeError('name and content are required')
  }
  try {
    const mergedConfig = mergeConfig(source, options)
    const symbol = convertToSymbol(source, mergedConfig)
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

function convertToSymbol(source: BakeSource, mergedConfig: SvgoConfig): string {
  // strip XML declaration (safe)
  let svg = source.content.trim().replace(/^\s*<\?xml[^>]*\?>\s*/i, '')

  // Try to detect viewBox first
  let viewBox: string | null = null
  const vbMatch = svg.match(/<svg\b[^>]*\bviewBox\s*=\s*"([^"]+)"[^>]*>/i)
  if (vbMatch) viewBox = vbMatch[1]

  // If no viewBox, and width+height present, infer `0 0 w h`
  if (!viewBox) {
    const widthMatch = svg.match(/<svg\b[^>]*\bwidth\s*=\s*"([^"]+)"[^>]*>/i)
    const heightMatch = svg.match(/<svg\b[^>]*\bheight\s*=\s*"([^"]+)"[^>]*>/i)
    if (widthMatch && heightMatch) {
      const parseNum = (s: string) => {
        const m = s.match(/-?\d+(\.\d+)?/)
        return m ? Number(m[0]) : NaN
      }
      const w = parseNum(widthMatch[1])
      const h = parseNum(heightMatch[1])
      if (Number.isFinite(w) && Number.isFinite(h)) {
        viewBox = `0 0 ${w} ${h}`
        // inject viewBox attribute into the svg root for svgo to see it
        svg = svg.replace(/<svg\b/, `<svg viewBox="${viewBox}"`)
      }
    }
  }

  // Run svgo.optimize
  let result: SvgoOutput
  try {
    result = optimize(svg, mergedConfig) as SvgoOutput
  } catch (err) {
    throw new Error(`SVGO optimization failed: ${String(err)}`)
  }

  const optimized = result && result.data ? result.data.trim() : ''

  // re-extract viewBox (may have been injected/normalized by svgo)
  if (!viewBox) {
    const vb2 = optimized.match(/<svg\b[^>]*\bviewBox\s*=\s*"([^"]+)"[^>]*>/i)
    if (vb2) viewBox = vb2[1]
  }

  if (!viewBox) {
    throw new Error('Cannot determine viewBox for SVG. Provide an SVG with viewBox or width/height attributes.')
  }

  // remove outer <svg ...> wrapper and extract inner markup
  const inner = optimized
    .replace(/^\s*<\?xml[^>]*\?>\s*/i, '')
    .replace(/^\s*<svg\b[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim()

  // Build final symbol (only id and viewBox attrs)
  return `<symbol id="${source.name}" viewBox="${viewBox}">${inner}</symbol>`
}

function mergeConfig(source: BakeSource, options?: Options): SvgoConfig {
  const prefix = `${source.name}-`
  const defaultConfig: SvgoConfig = {
    // using svgo v4 style, preset-default then append custom plugins
    plugins: [
      // reference: https://svgo.dev/docs/preset-default/
      { name: 'preset-default' },
      // reference: https://svgo.dev/docs/plugins/removeXMLNS/
      { name: 'removeXMLNS' },
      // reference: https://svgo.dev/docs/plugins/removeXlink/
      { name: 'removeXlink' },
      // require view-box, not width/height; reference: https://svgo.dev/docs/plugins/removeDimensions/
      { name: 'removeDimensions' },
      // require unique id; reference: https://svgo.dev/docs/plugins/prefixIds/
      { name: 'prefixIds', params: { prefix, delim: '' } },
    ],
  }
  const userSvgoConfig = options?.svgoConfig
  return { ...defaultConfig, ...(userSvgoConfig || {}) }
}
