import { describe, it, expect } from 'vitest'
import { bakeIcons, batchBake } from '../baker'
import { createRecipe } from '../recipes'

describe('Icon Baker', () => {
  const testSVG = '<svg><path d="M10 10"/></svg>'

  it('should bake single icon', async () => {
    const results = await bakeIcons([{ name: 'test', content: testSVG }], createRecipe())

    expect(results[0].success).toBe(true)
    expect(results[0].symbol).toContain('symbol')
    expect(results[0].symbol).toContain('icon-test')
  })

  it('should batch bake multiple icons', async () => {
    const sprite = await batchBake(
      [
        { name: 'icon1', content: testSVG },
        { name: 'icon2', content: testSVG },
      ],
      createRecipe()
    )

    expect(sprite).toContain('<svg')
    expect(sprite).toContain('icon-icon1')
    expect(sprite).toContain('icon-icon2')
  })
})
