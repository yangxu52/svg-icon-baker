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
  svgoConfig?: SvgoConfig
}
