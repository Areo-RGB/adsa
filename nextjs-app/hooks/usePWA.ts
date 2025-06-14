import { useEffect, useState } from 'react'

interface PWAConfig {
  enabled: boolean
  name: string
  remindDays: number
  scope: string
  swLocation: string
}

export function usePWA(config: PWAConfig) {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    if (!config.enabled || process.env.NODE_ENV === 'development') return

    // Register service worker only in production
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(config.swLocation, { scope: config.scope })
        .then(registration => {
          console.log('SW registered:', registration)
        })
        .catch(error => {
          console.warn('SW registration failed:', error)
        })
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [config])

  const installPWA = async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstallable(false)
      return true
    }
    
    return false
  }

  return {
    isInstallable,
    installPWA
  }
}