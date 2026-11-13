import type { Deck, WordFamily } from '../data/wordFamilies.ts'
import type { Progress } from '../hooks/useProgress.ts'
import { iconUrl } from '../openmoji.ts'

interface FamilyPickerProps {
  decks: Deck[]
  deckId: string
  progress: Progress
  onDeck: (deckId: string) => void
  onPick: (family: WordFamily) => void
  onReset: () => void
}

export function FamilyPicker({ decks, deckId, progress, onDeck, onPick, onReset }: FamilyPickerProps) {
  const deck = decks.find((candidate) => candidate.id === deckId) ?? decks[0]
  const started = deck.sections.some((section) =>
    section.families.some((family) => progress[family.id]?.seen.length),
  )

  return (
    <div className="picker">
      <nav className="tabs">
        {decks.map((candidate) => (
          <button
            key={candidate.id}
            className={candidate.id === deck.id ? 'tab tab--active' : 'tab'}
            onClick={() => onDeck(candidate.id)}
          >
            {candidate.title}
          </button>
        ))}
      </nav>

      {deck.sections.map((section) => (
        <section className="shelf" key={section.title}>
          <h2 className="shelf__title">{section.title}</h2>
          <div className="shelf__row">
            {section.families.map((family) => (
              <button
                key={family.id}
                className="tile"
                style={{ ['--family-color' as string]: family.color }}
                onClick={() => onPick(family)}
              >
                <span className={family.title ? 'tile__rime tile__rime--words' : 'tile__rime'}>
                  {tileLabel(family)}
                </span>
                {family.hint && <span className="tile__hint">{family.hint}</span>}
                <span className="tile__preview">
                  {family.words
                    .filter((word) => word.emoji)
                    .slice(0, 3)
                    .map((word) => (
                      <img key={word.part} src={iconUrl(word.emoji!)} alt="" draggable={false} />
                    ))}
                </span>
                <TileProgress seen={progress[family.id]?.seen.length ?? 0} total={family.words.length} />
              </button>
            ))}
          </div>
        </section>
      ))}

      {started && (
        <div className="picker__footer">
          <button className="picker__reset" onClick={onReset}>
            сбросить прогресс
          </button>
          <p className="picker__note">прогресс обнуляется каждый день сам</p>
        </div>
      )}
    </div>
  )
}

function tileLabel(family: WordFamily) {
  if (family.title) return family.title
  return family.side === 'end' ? `-${family.fixed}` : `${family.fixed}-`
}

function TileProgress({ seen, total }: { seen: number; total: number }) {
  if (!seen) return <span className="tile__progress" />

  if (seen >= total) {
    return (
      <span className="tile__progress">
        <span className="tile__done">✓ прочитано</span>
      </span>
    )
  }

  return (
    <span className="tile__progress">
      <span className="tile__bar">
        <span className="tile__bar-fill" style={{ width: `${(seen / total) * 100}%` }} />
      </span>
      <span className="tile__count">
        {seen}/{total}
      </span>
    </span>
  )
}
