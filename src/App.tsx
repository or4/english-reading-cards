import { useCallback, useEffect, useState } from 'react'
import { familySections, wordFamilies, type WordFamily } from './data/wordFamilies.ts'
import { useProgress, type Progress } from './hooks/useProgress.ts'
import { FamilyPicker } from './components/FamilyPicker.tsx'
import { FlipBook } from './components/FlipBook.tsx'

export function App() {
  const [family, setFamily] = useState<WordFamily | undefined>(familyFromHash)
  const { progress, visit } = useProgress()
  const familyId = family?.id

  useEffect(() => {
    const onHashChange = () => setFamily(familyFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // при заходе сразу по ссылке на группу под ней нет записи с главным экраном, и «назад» увёл бы с сайта
  useEffect(() => {
    if (!location.hash) return
    const group = location.hash
    history.replaceState(undefined, '', location.pathname + location.search)
    history.pushState(undefined, '', group)
  }, [])

  const handleVisit = useCallback(
    (index: number) => {
      if (familyId) visit(familyId, index)
    },
    [familyId, visit],
  )

  if (!family) {
    return <FamilyPicker sections={familySections} onPick={(picked) => (location.hash = picked.id)} />
  }

  return (
    <FlipBook
      key={family.id}
      family={family}
      startIndex={startIndex(family, progress)}
      onVisit={handleVisit}
      onExit={() => history.back()}
    />
  )
}

function familyFromHash() {
  const id = decodeURIComponent(location.hash.slice(1))
  return wordFamilies.find((family) => family.id === id)
}

function startIndex(family: WordFamily, progress: Progress) {
  const saved = progress[family.id]
  if (!saved || saved.seen.length >= family.words.length) return 0
  return saved.index
}
