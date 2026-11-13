import { mkdir, writeFile, readdir } from 'node:fs/promises'
import { wordFamilies, type WordFamily, type Word } from '../src/data/wordFamilies.ts'
import { emojiToCode } from '../src/openmoji.ts'

const iconsDir = new URL('../public/icons/', import.meta.url)
const openMojiBase = 'https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg'
const batchSize = 24

await mkdir(iconsDir, { recursive: true })

const wanted = new Map<string, string>()
for (const family of wordFamilies) {
  for (const word of family.words) {
    if (word.emoji) wanted.set(emojiToCode(word.emoji), wordText(family, word))
  }
}

const onDisk = new Set((await readdir(iconsDir)).map((name) => name.replace(/\.svg$/, '')))
const missingOnDisk = [...wanted.keys()].filter((code) => !onDisk.has(code))
const stale = [...onDisk].filter((code) => !wanted.has(code))

const failed: string[] = []
for (let start = 0; start < missingOnDisk.length; start += batchSize) {
  await Promise.all(
    missingOnDisk.slice(start, start + batchSize).map(async (code) => {
      const response = await fetch(`${openMojiBase}/${code}.svg`)
      if (!response.ok) {
        failed.push(`${wanted.get(code)} → ${code} (${response.status})`)
        return
      }
      await writeFile(new URL(`${code}.svg`, iconsDir), await response.text())
    }),
  )
}

console.log(`нужно ${wanted.size}, скачано ${missingOnDisk.length - failed.length}, уже было ${onDisk.size - stale.length}`)
if (stale.length) console.log(`лишних на диске: ${stale.length} (${stale.join(', ')})`)
if (failed.length) {
  console.log('нет картинки:\n' + failed.join('\n'))
  process.exitCode = 1
}

function wordText(family: WordFamily, word: Word) {
  return family.side === 'end' ? `${word.part}${family.fixed}` : `${family.fixed}${word.part}`
}
