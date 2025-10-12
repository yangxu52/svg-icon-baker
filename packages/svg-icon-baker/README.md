# svg-icon-baker

> Bake your raw SVG icons into delicious symbol sprites! 🍪

The core library for transforming SVG icons into optimized SVG symbol sprites with customizable baking recipes.

## Installation

```bash
npm install svg-icon-baker
# or
yarn add svg-icon-baker
# or
pnpm add svg-icon-baker
```

## Usage

### Basic Usage

```js
import { bakeIcons, createRecipe } from 'svg-icon-baker'

const recipe = createRecipe({
  prefix: 'icon-',
  optimize: true,
})

const svgSources = [
  { name: 'home', content: '<svg>...</svg>' },
  { name: 'user', content: '<svg>...</svg>' },
]

const results = await bakeIcons(svgSources, recipe)
```

### Batch Processing

```js
import { batchBake } from 'svg-icon-baker'

const spriteSheet = await batchBake(svgSources, recipe)
console.log(spriteSheet)
// <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
//   <symbol id="icon-home">...</symbol>
//   <symbol id="icon-user">...</symbol>
// </svg>
```

## API

**`bakeIcons(svgSources, recipe)`**

Transform individual SVG files into symbols.

**`batchBake(svgSources, recipe)`**

Create a complete SVG sprite sheet from multiple icons.

**`createRecipe(options)`**

Create a custom baking recipe with your preferred settings.

## Recipes

```js
const customRecipe = createRecipe({
  prefix: 'custom-', // Add prefix to symbol IDs
  optimize: true, // Enable SVG optimization
  removeDimensions: true, // Remove width/height attributes
  addViewBox: true, // Ensure viewBox is present
  namespaceIds: true, // Namespace ID references
  prettify: true, // Format output
})
```

## Features

- 🎯 SVG Optimization - Remove redundant data and optimize paths
- 🔗 Reference Handling - Properly namespace IDs and class names
- 🎨 ViewBox Management - Ensure consistent sizing
- 📦 Batch Processing - Efficiently process multiple icons
- 🍪 Custom Recipes - Tailor the baking process to your needs

## License

MIT © [yangxu52](https://github.com/yangxu52)
