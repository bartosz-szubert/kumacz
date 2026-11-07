interface VoiceInfo {
  lang: string
  localService?: boolean
}

// localService is the browser's locality contract; unknown is not eligible (D-62).
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService
export function selectLocalVoice<T extends VoiceInfo>(voices: readonly T[], language: string): T | undefined {
  const target = language.toLowerCase().replaceAll('_', '-')
  return voices.find((voice) => {
    if (voice.localService !== true) return false
    const lang = voice.lang.toLowerCase().replaceAll('_', '-')
    if (target === 'en-gb') return lang === 'en-gb' || lang.startsWith('en-gb-')
    if (target === 'pl-pl') return lang === 'pl' || lang === 'pl-pl'
    return false
  })
}
