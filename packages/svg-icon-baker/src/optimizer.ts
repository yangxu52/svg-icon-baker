import { optimize } from 'svgo'
import type { BakingRecipe } from './types.ts'

export async function optimizeSVG(svgContent: string, recipe: BakingRecipe): Promise<string> {
  if (!recipe.optimize) {
    return svgContent
  }

  const result = optimize(svgContent, {
    plugins: [
      'removeDoctype',
      'removeXMLProcInst',
      'removeComments',
      'removeMetadata',
      'removeEditorsNSData',
      'cleanupAttrs',
      'mergeStyles',
      'inlineStyles',
      'minifyStyles',
      // ... 更多 SVGO 插件
    ],
  })

  return result.data
}

export function normalizeSVG(svgContent: string): string {
  // 标准化 SVG 内容
  return svgContent.trim().replace(/\s+/g, ' ')
}
