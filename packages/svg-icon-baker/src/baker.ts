import type { BakingRecipe, SVGSource, BakeResult } from './types.ts'
import { optimizeSVG } from './optimizer.ts'

export async function bakeIcons(svgSources: SVGSource[], recipe: BakingRecipe): Promise<BakeResult[]> {
  const results: BakeResult[] = []

  for (const source of svgSources) {
    try {
      const optimizedSVG = await optimizeSVG(source.content, recipe)
      const symbol = convertToSymbol(optimizedSVG, source.name, recipe)
      results.push({
        name: source.name,
        symbol,
        originalSize: source.content.length,
        optimizedSize: symbol.length,
        success: true,
      })
    } catch (error) {
      results.push({
        name: source.name,
        symbol: '',
        originalSize: source.content.length,
        optimizedSize: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
}

export async function batchBake(svgSources: SVGSource[], recipe: BakingRecipe): Promise<string> {
  const results = await bakeIcons(svgSources, recipe)
  const symbols = results
    .filter((result) => result.success)
    .map((result) => result.symbol)
    .join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n${symbols}\n</svg>`
}

function convertToSymbol(svgContent: string, name: string, recipe: BakingRecipe): string {
  // SVG 到 symbol 的核心转换逻辑
  // 包括添加前缀、处理引用、清理冗余属性等
  return `<symbol id="${recipe.prefix}${name}" viewBox="0 0 24 24">${svgContent}</symbol>`
}
