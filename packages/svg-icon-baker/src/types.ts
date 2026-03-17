import type { Output, PluginConfig } from 'svgo'

export type SvgoPlugins = PluginConfig[]
export type SvgoOutput = Output

export type BakeSource = {
  name: string
  content: string
}

export type BakeResult = {
  name: string
  symbol: string
}

export type ManualOptions = {
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

export type Options = boolean | ManualOptions
