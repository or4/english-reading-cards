import { useCallback } from 'react'

export function useSpeech() {
  const supported = 'speechSynthesis' in window

  // голос намеренно не выбирается: браузер берёт системный для en-US, поэтому он один и тот же
  // и при входе в группу, и при листании — со своим выбором первое слово успевало прозвучать другим
  const speak = useCallback(
    (text: string, rate = 0.9) => {
      if (!supported) return
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    },
    [supported],
  )

  return { speak, supported }
}
