import type { FamilySection, WordFamily } from '../data/wordFamilies.ts'
import { iconUrl } from '../openmoji.ts'

interface FamilyPickerProps {
  sections: FamilySection[]
  onPick: (family: WordFamily) => void
}

export function FamilyPicker({ sections, onPick }: FamilyPickerProps) {
  return (
    <div className="picker">
      <h1 className="picker__title">Выбери группу</h1>
      {sections.map((section) => (
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
                <span className="tile__rime">
                  {family.side === 'end' ? `-${family.fixed}` : `${family.fixed}-`}
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
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
