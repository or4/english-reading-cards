import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { WordFamily, Word } from '../data/wordFamilies.ts'
import { iconUrl } from '../openmoji.ts'
import { useSpeech } from '../hooks/useSpeech.ts'
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, SnailIcon, VolumeIcon } from './icons.tsx'

const flipDuration = 520
const comfortableLength = 5
const slowRate = 0.2
const confettiColors = ['#e8453c', '#f2971f', '#f7c325', '#8bc53f', '#2eb872', '#1fb3c4', '#2f86d9', '#9b51e0', '#d94fa8']

interface FlipBookProps {
  family: WordFamily
  startIndex: number
  onVisit: (index: number) => void
  onExit: () => void
}

interface Flip {
  top: Word
  under: Word
  direction: 'forward' | 'back'
}

export function FlipBook({ family, startIndex, onVisit, onExit }: FlipBookProps) {
  const { words, fixed, side, color } = family
  const [index, setIndex] = useState(Math.min(startIndex, words.length - 1))
  const [flip, setFlip] = useState<Flip>()
  const [finished, setFinished] = useState(false)
  const { speak, supported } = useSpeech()
  const word = wordText(family, words[index])
  const whole = !fixed

  useEffect(() => onVisit(index), [index, onVisit])

  const spokenWord = useRef<string>(undefined)
  useEffect(() => {
    if (finished || spokenWord.current === word) return
    spokenWord.current = word
    speak(word)
  }, [word, finished, speak])

  const turn = useCallback(
    (direction: 'forward' | 'back') => {
      if (flip || finished) return
      if (direction === 'forward' && index === words.length - 1) {
        setFinished(true)
        return
      }
      if (direction === 'back' && index === 0) return

      const next = direction === 'forward' ? index + 1 : index - 1
      setFlip(
        direction === 'forward'
          ? { top: words[index], under: words[next], direction }
          : { top: words[next], under: words[index], direction },
      )
      setIndex(next)
    },
    [flip, finished, index, words],
  )

  useEffect(() => {
    if (!flip) return
    const timer = setTimeout(() => setFlip(undefined), flipDuration)
    return () => clearTimeout(timer)
  }, [flip])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') turn('forward')
      if (event.key === 'ArrowLeft') turn('back')
      if (event.key === 'Escape') onExit()
      if (event.key === ' ') {
        event.preventDefault()
        speak(word)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [turn, onExit, speak, word])

  if (finished) return <Finished family={family} onExit={onExit} />

  const under = flip ? flip.under : words[index]

  const flipHalf = (
    <div className="book__flip">
      <Leaf word={under} fixed={fixed} />
      {flip && (
        <div className={`leaf leaf--${flip.direction}`}>
          <Leaf word={flip.top} fixed={fixed} />
          <div className="leaf__back" />
        </div>
      )}
      <div className="book__rings" />
    </div>
  )

  const fixedHalf = (
    <div className="book__fixed">
      <span className="book__glyph" style={glyphScale(words[index].part, fixed)}>
        {fixed}
      </span>
    </div>
  )

  return (
    <div className="flipbook" style={{ ['--family-color' as string]: color }}>
      <header className="flipbook__bar">
        <button className="chip" onClick={onExit}>
          <ArrowLeftIcon />
          группы
        </button>
        <span className="chip chip--muted">
          {index + 1} / {words.length}
        </span>
      </header>

      <div
        className={`book book--${whole ? 'whole' : side}`}
        onClick={() => turn('forward')}
        role="button"
        tabIndex={0}
        aria-label={`${word}, нажми чтобы перевернуть`}
      >
        {whole ? (
          flipHalf
        ) : side === 'end' ? (
          <>
            {flipHalf}
            {fixedHalf}
          </>
        ) : (
          <>
            {fixedHalf}
            {flipHalf}
          </>
        )}
      </div>

      <div className="flipbook__word" aria-live="polite">
        {whole ? (
          words[index].part
        ) : side === 'end' ? (
          <>
            {words[index].part}
            <span className="flipbook__fixed">{fixed}</span>
          </>
        ) : (
          <>
            <span className="flipbook__fixed">{fixed}</span>
            {words[index].part}
          </>
        )}
      </div>

      <div className="flipbook__ru">{words[index].ru}</div>

      {words[index].example && (
        <button className="example" onClick={() => speak(words[index].example!)}>
          <VolumeIcon />
          <span className="example__text">
            <span className="example__en">{words[index].example}</span>
            <span className="example__ru">{words[index].exampleRu}</span>
          </span>
        </button>
      )}

      <footer className="flipbook__controls">
        <button className="round" onClick={() => turn('back')} disabled={index === 0} aria-label="Назад">
          <ChevronLeftIcon />
        </button>
        {supported && (
          <>
            <button className="round round--speak" onClick={() => speak(word)} aria-label="Произнести">
              <VolumeIcon />
            </button>
            <button className="round" onClick={() => speak(word, slowRate)} aria-label="Произнести медленно">
              <SnailIcon />
            </button>
          </>
        )}
        <button className="round" onClick={() => turn('forward')} aria-label="Вперёд">
          <ChevronRightIcon />
        </button>
      </footer>
    </div>
  )
}

export function wordText(family: WordFamily, word: Word) {
  return family.side === 'end' ? `${word.part}${family.fixed}` : `${family.fixed}${word.part}`
}

// обе половины слова масштабируются одинаково, иначе у «string» буквы «str» и «ing» были бы разного роста
function glyphScale(part: string, fixed: string): CSSProperties {
  return { ['--glyph-scale' as string]: Math.min(1, comfortableLength / (part.length + fixed.length)) }
}

function Finished({ family, onExit }: { family: WordFamily; onExit: () => void }) {
  return (
    <div className="done" style={{ ['--family-color' as string]: family.color }}>
      <Confetti />
      <img className="done__icon" src={iconUrl('🎉')} alt="" draggable={false} />
      <h2 className="done__title">Молодец!</h2>
      <p className="done__text">
        Все слова {family.side === 'end' ? `на «-${family.fixed}»` : `на «${family.fixed}-»`} прочитаны —{' '}
        {family.words.length} из {family.words.length}
      </p>
      <button className="done__button" onClick={onExit}>
        на главную
      </button>
    </div>
  )
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 54 }, (_, position) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2.4,
        duration: 2.6 + Math.random() * 2.2,
        drift: Math.random() * 140 - 70,
        color: confettiColors[position % confettiColors.length],
      })),
    [],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece, position) => (
        <span
          key={position}
          className="confetti__piece"
          style={
            {
              '--left': `${piece.left}%`,
              '--delay': `${piece.delay}s`,
              '--duration': `${piece.duration}s`,
              '--drift': `${piece.drift}px`,
              '--color': piece.color,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

function Leaf({ word, fixed }: { word: Word; fixed: string }) {
  return (
    <div className="leaf__face">
      {word.emoji ? (
        <img className="leaf__icon" src={iconUrl(word.emoji)} alt="" draggable={false} />
      ) : (
        <span className="leaf__icon" />
      )}
      <span className="book__glyph" style={glyphScale(word.part, fixed)}>
        {word.part}
      </span>
    </div>
  )
}

