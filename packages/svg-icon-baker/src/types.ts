import type { Config, Output } from 'svgo'

export type SvgoConfig = Partial<Config>
export type SvgoOutput = Output

export type BakeSource = {
  name: string
  content: string
}

export type BakeResult = {
  name: string
  symbol: string
  success: boolean
  error?: string
}

export type Options = {
  /**
   * default plugin preset
   * @default true
   */
  defaultPreset?: boolean
  /**
   * convert one stop gradients to inline styles
   * @default false
   */
  convertOneStopGradients?: boolean
  /**
   * convert style to attrs
   * @default false
   */
  convertStyleToAttrs?: boolean
  /**
   * reuse paths
   * @default false
   */
  reusePaths?: boolean
  /**
   * remove scripts
   * @default false
   */
  removeScripts?: boolean
  /**
   * remove title
   * @default true
   */
  removeTitle?: boolean
  /**
   * remove xmlns
   * @default true
   */
  removeXMLNS?: boolean
  /**
   * remove xlink
   * @default true
   */
  removeXlink?: boolean
}
