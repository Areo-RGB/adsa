import { useCallback } from 'react'

export function useAudio() {
  const playBeep = useCallback((frequency: number = 880, duration: number = 200) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      const ctx = new AudioCtx()
      const oscillator = ctx.createOscillator()
      
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      oscillator.connect(ctx.destination)
      oscillator.start()
      
      setTimeout(() => {
        oscillator.stop()
        ctx.close()
      }, duration)
    } catch (err) {
      console.warn('Web Audio API beep failed:', err)
    }
  }, [])

  const playSound = useCallback((audioElement?: HTMLAudioElement, fallbackFrequency: number = 880, duration: number = 200) => {
    if (audioElement && audioElement.src) {
      const playPromise = audioElement.play?.()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => playBeep(fallbackFrequency, duration))
      }
    } else {
      playBeep(fallbackFrequency, duration)
    }
  }, [playBeep])

  return { playBeep, playSound }
}