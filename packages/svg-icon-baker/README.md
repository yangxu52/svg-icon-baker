# svg-icon-baker

> Bake the `svg` icon into `symbol` 🍪

The core library for transforming SVG icons into optimized SVG symbol sprite.

If you like this project, please give it a [Star](https://github.com/yangxu52/svg-icon-baker).

## Usage

```js
import { bakeIcon } from 'svg-icon-baker'

const bakeSource = { name: 'home', content: '<svg>...</svg>' }

// result: {name: 'home', symbol: '<symbol>...</symbol>', success: true}
const result = await bakeIcons(svgSources)
```

## API

**`bakeIcon(bakeSource, options?)`**

convert SVG into symbols.

## Features

- 🎯 SVG Optimization - Remove redundant data and optimize paths
- 🔗 Reference Handling - Properly namespace IDs and class names
- 🎨 ViewBox Management - Ensure consistent sizing

## License

MIT © [yangxu52](https://github.com/yangxu52/svg-icon-baker/blob/main/LICENSE)
