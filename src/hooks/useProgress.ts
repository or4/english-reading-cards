import { useCallback, useEffect, useState } from 'react'

export interface FamilyProgress {
  index: number
  seen: number[]
}

export type Progress = Record<string, FamilyProgress>

interface StoredProgress {
  day: string
  families: Progress
}

const storageKey = 'english-cards-progress'

export function useProgress() {
  const [stored, setStored] = useState<StoredProgress>(readProgress)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(stored))
    } catch {
      /* приватный режим или переполненное хранилище — прогресс просто не переживёт перезагрузку */
    }
  }, [stored])

  const visit = useCallback((id: string, index: number) => {
    const day = currentDay()
    setStored((current) => {
      const families = current.day === day ? current.families : {}
      const family = families[id] ?? { index: 0, seen: [] }
      const alreadyThere = family.index === index && family.seen.includes(index)
      if (alreadyThere && current.day === day) return current

      const seen = family.seen.includes(index) ? family.seen : [...family.seen, index]
      return { day, families: { ...families, [id]: { index, seen } } }
    })
  }, [])

  const reset = useCallback(() => setStored({ day: currentDay(), families: {} }), [])

  return { progress: stored.families, visit, reset }
}

function readProgress(): StoredProgress {
  const empty = { day: currentDay(), families: {} }
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as StoredProgress
    return parsed.day === currentDay() ? parsed : empty
  } catch {
    return empty
  }
}

// день берётся по местному времени: с UTC вечерние занятия попадали бы в следующие сутки
function currentDay() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}
