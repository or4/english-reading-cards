export function iconUrl(emoji: string): string {
  return `${import.meta.env.BASE_URL}icons/${emojiToCode(emoji)}.svg`
}

export function emojiToCode(emoji: string): string {
  const points = [...emoji].map((char) => char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0'))
  const isKeycap = points.includes('20E3')
  return (isKeycap ? points : points.filter((point) => point !== 'FE0F')).join('-')
}
