# svg-icon-baker

> Bake the `svg` icon into `symbol` 🍪

The core library for transforming SVG icons into optimized SVG symbol sprite.

If you like this project, please give it a [Star](https://github.com/yangxu52/svg-icon-baker).

## Usage

```js
import { bakeIcon } from 'svg-icon-baker'

const source = { name: 'home', content: '<svg>...</svg>' }
const result = await bakeIcon(source)
// result: { name: 'home', symbol: '<symbol>...</symbol>' }
```

## API

**`bakeIcon(bakeSource, options?)`**

convert SVG into symbols.

## Options

| name                      | type      | default | description                                        |
| ------------------------- | --------- | ------- | -------------------------------------------------- |
| `defaultPreset`           | `boolean` | `true`  | Enable SVGO `preset-default`.                      |
| `convertOneStopGradients` | `boolean` | `false` | Convert one-stop gradients.                        |
| `convertStyleToAttrs`     | `boolean` | `false` | Convert style blocks to attributes.                |
| `reusePaths`              | `boolean` | `false` | Try to reuse identical paths.                      |
| `removeScripts`           | `boolean` | `false` | Drop `<script>` for safety.                        |
| `removeTitle`             | `boolean` | `true`  | Remove `<title>` elements from symbols.            |
| `removeXMLNS`             | `boolean` | `true`  | Remove xmlns on root (not needed inside sprite).   |
| `removeXlink`             | `boolean` | `true`  | Remove xlink namespace (modern browsers use href). |

Notes:

- The library prefixes internal ids and URL references via SVGO `prefixIds`, using the icon name as prefix (e.g., `name-xxxxx`).
- Width/height on the root `<svg>` are removed; viewBox is required or inferred by SVGO from width/height when possible.

## Type Definitions

```ts
// BakeSource
interface BakeSource {
  name: string
  content: string
}

// BakeResult
interface BakeResult {
  name: string
  symbol: string
}

// Options
interface Options {
  defaultPreset?: boolean
  convertOneStopGradients?: boolean
  convertStyleToAttrs?: boolean
  reusePaths?: boolean
  removeScripts?: boolean
  removeTitle?: boolean
  removeXMLNS?: boolean
  removeXlink?: boolean
}
```

## Features

- 🎯 SVG Optimization - Remove redundant data and optimize paths
- 🔗 Reference Handling - Properly namespace IDs and class names
- 🎨 ViewBox Management - Ensure consistent sizing

## License

MIT © [yangxu52](https://github.com/yangxu52/svg-icon-baker/blob/main/LICENSE)
