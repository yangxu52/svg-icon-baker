import type { BakingRecipe } from './types.ts'

export const defaultRecipe: BakingRecipe = {
  prefix: 'icon-',
  optimize: true,
  removeDimensions: true,
  addViewBox: true,
  namespaceIds: true,
  namespaceClassnames: true,
  prettify: true,
}

export function createRecipe(customRecipe: Partial<BakingRecipe> = {}): BakingRecipe {
  return {
    ...defaultRecipe,
    ...customRecipe,
  }
}
