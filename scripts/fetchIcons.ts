import { mkdir, writeFile } from 'node:fs/promises'
import { wordFamilies, type WordFamily, type Word } from '../src/data/wordFamilies.ts'
import { emojiToCode } from '../src/openmoji.ts'

const iconsDir = new URL('../public/icons/', import.meta.url)
const openMojiBase = 'https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg'

await mkdir(iconsDir, { recursive: true })

const codes = new Map<string, string>()
for (const family of wordFamilies) {
  for (const word of family.words) {
    if (word.emoji) codes.set(emojiToCode(word.emoji), wordText(family, word))
  }
}

const missing: string[] = []

for (const [code, word] of codes) {
  const response = await fetch(`${openMojiBase}/${code}.svg`)
  if (!response.ok) {
    missing.push(`${word} → ${code} (${response.status})`)
    continue
  }
  await writeFile(new URL(`${code}.svg`, iconsDir), await response.text())
}

console.log(`saved ${codes.size - missing.length} of ${codes.size} icons`)
if (missing.length) {
  console.log('missing:\n' + missing.join('\n'))
  process.exitCode = 1
}

function wordText(family: WordFamily, word: Word) {
  return family.side === 'end' ? `${word.part}${family.fixed}` : `${family.fixed}${word.part}`
}
