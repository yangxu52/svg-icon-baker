# svg-icon-baker

> Bake the `svg` icon into `symbol` 🍪

The core library for transforming SVG icons into optimized SVG symbol sprites.

If you like this project, please give it a [Star](https://github.com/yangxu52/svg-icon-baker).

## Usage

```ts
import { bakeIcon, bakeIcons } from 'svg-icon-baker'

const source = { name: 'home', content: '<svg viewBox="0 0 16 16">...</svg>' }
const result = bakeIcon(source)
// result: { name: 'home', content: '<symbol id="home" viewBox="0 0 16 16">...</symbol>' }

const results = bakeIcons([source])
```

`bakeIcon` and `bakeIcons` are synchronous.

## API

### `bakeIcon(source: BakeSource, options?: Options): BakeResult`

Convert one SVG into one symbol result.

### `bakeIcons(sources: BakeSource[], options?: Options): BakeResult[]`

Convert multiple SVG inputs with one inferred option set.

## Options

| name                      | type      | default | description                                        |
| ------------------------- | --------- | ------- | -------------------------------------------------- |
| `defaultPreset`           | `boolean` | `true`  | Enable SVGO `preset-default`.                      |
| `convertOneStopGradients` | `boolean` | `false` | Convert one-stop gradients.                        |
| `convertStyleToAttrs`     | `boolean` | `false` | Convert style blocks to attributes.                |
| `reusePaths`              | `boolean` | `false` | Try to reuse identical paths.                      |
| `removeScripts`           | `boolean` | `false` | Drop `<script>` for safety.                        |
| `removeTitle`             | `boolean` | `true`  | Remove `<title>` elements from symbols.            |
| `removeXMLNS`             | `boolean` | `true`  | Remove xmlns on root when emitting sprite content. |
| `removeXlink`             | `boolean` | `true`  | Remove xlink namespace and prefer `href`.          |

Notes:

- Set `true` to use the default optimization set.
- Set `false` to disable optional optimizations. Mandatory conversion steps still run, including `removeDimensions`, `prefixIds`, and SVG-to-symbol rewriting.
- The library prefixes internal ids and URL references via SVGO `prefixIds`, using the icon name as prefix, for example `home-a`.
- Root `width` and `height` are removed. `viewBox` must already exist or be inferable from root dimensions.

## Type Definitions

```ts
type BakeSource = {
  name: string
  content: string
}

type BakeResult = {
  name: string
  content: string
}

type Options =
  | {
      defaultPreset?: boolean
      convertOneStopGradients?: boolean
      convertStyleToAttrs?: boolean
      reusePaths?: boolean
      removeScripts?: boolean
      removeTitle?: boolean
      removeXMLNS?: boolean
      removeXlink?: boolean
    }
  | boolean
```

## Features

- 🎯 Optimization: Reduce file size, and improve efficiency through `SVGO`
- 🔗 Reference Handling: ID and reference prefixing for sprite safety
- 🎨 Size Unify: `viewBox` preservation or inference from root dimensions

## License

MIT © [yangxu52](https://github.com/yangxu52/svg-icon-baker/blob/main/LICENSE)
