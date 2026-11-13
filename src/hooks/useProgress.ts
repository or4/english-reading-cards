import { useCallback, useEffect, useState } from 'react'

export interface FamilyProgress {
  index: number
  seen: number[]
}

export type Progress = Record<string, FamilyProgress>

const storageKey = 'english-cards-progress'

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(readProgress)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress))
    } catch {
      /* приватный режим или переполненное хранилище — прогресс просто не переживёт перезагрузку */
    }
  }, [progress])

  const visit = useCallback((rime: string, index: number) => {
    setProgress((current) => {
      const family = current[rime] ?? { index: 0, seen: [] }
      if (family.index === index && family.seen.includes(index)) return current
      const seen = family.seen.includes(index) ? family.seen : [...family.seen, index]
      return { ...current, [rime]: { index, seen } }
    })
  }, [])

  return { progress, visit }
}

function readProgress(): Progress {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? (JSON.parse(stored) as Progress) : {}
  } catch {
    return {}
  }
}
