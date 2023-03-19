import Service from "../music/src/Service"

describe('Music Service', () => {
  it('should search a keyword', async () => {
    const result = await Service.search('Never Gonna Give You Up')
    const firstItem = result[0]

    expect(Array.isArray(result)).toBe(true)
    expect(typeof firstItem?.id).toBe('string')
    expect(typeof firstItem?.thumbnail).toBe('string')
    expect(typeof firstItem?.title).toBe('string')
    expect(typeof firstItem?.url).toBe('string')
  })

  it('should get music info with url', async () => {
    const result = await Service.getSong('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    expect(typeof result?.id).toBe('string')
    expect(typeof result?.title).toBe('string')
    expect(typeof result?.url).toBe('string')
  })
})