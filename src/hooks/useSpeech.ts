import { useCallback, useEffect, useState } from 'react'

const preferredVoices = ['Samantha', 'Karen', 'Daniel', 'Google US English', 'Microsoft Aria Online (Natural) - English (United States)']

export function useSpeech() {
  const voice = useEnglishVoice()
  const supported = 'speechSynthesis' in window

  const speak = useCallback(
    (text: string, rate = 0.9) => {
      if (!supported) return
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.lang = voice?.lang ?? 'en-US'
      if (voice) utterance.voice = voice
      speechSynthesis.speak(utterance)
    },
    [voice, supported],
  )

  return { speak, supported }
}

function useEnglishVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice>()

  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    const pickVoice = () => {
      const english = speechSynthesis.getVoices().filter((candidate) => candidate.lang.startsWith('en'))
      if (!english.length) return
      setVoice(
        english.find((candidate) => preferredVoices.includes(candidate.name)) ??
          english.find((candidate) => candidate.lang === 'en-US') ??
          english[0],
      )
    }

    pickVoice()
    speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => speechSynthesis.removeEventListener('voiceschanged', pickVoice)
  }, [])

  return voice
}
