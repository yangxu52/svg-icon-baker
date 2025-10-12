export type BakingRecipe = {
  prefix: string
  optimize: boolean
  removeDimensions: boolean
  addViewBox: boolean
  namespaceIds: boolean
  namespaceClassnames: boolean
  prettify: boolean
}

export type SVGSource = {
  name: string
  content: string
}

export type BakeResult = {
  name: string
  symbol: string
  originalSize: number
  optimizedSize: number
  success: boolean
  error?: string
}

export type IconBakerOptions = {
  svgSources: SVGSource[]
  recipe?: Partial<BakingRecipe>
}
