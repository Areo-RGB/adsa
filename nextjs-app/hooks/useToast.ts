import { useCallback } from 'react'

type ToastType = 'info' | 'success' | 'error' | 'warning'

interface ToastOptions {
  title: string
  message: string
  type?: ToastType
  duration?: number
}

export function useToast() {
  const showToast = useCallback(({ title, message, type = 'info', duration = 5000 }: ToastOptions) => {
    let toastContainer = document.getElementById('toast-container')
    
    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.id = 'toast-container'
      Object.assign(toastContainer.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '9999',
        maxWidth: '350px'
      })
      document.body.appendChild(toastContainer)
    }

    const toast = document.createElement('div')
    const toastId = 'toast-' + Date.now()
    toast.id = toastId

    let bgColor: string, iconClass: string, iconColor: string
    
    switch (type) {
      case 'success':
        bgColor = 'bg-green-dark'
        iconClass = 'fa-check-circle'
        iconColor = 'color-green-light'
        break
      case 'error':
        bgColor = 'bg-red-dark'
        iconClass = 'fa-exclamation-circle'
        iconColor = 'color-red-light'
        break
      case 'warning':
        bgColor = 'bg-yellow-dark'
        iconClass = 'fa-exclamation-triangle'
        iconColor = 'color-yellow-light'
        break
      default:
        bgColor = 'bg-highlight'
        iconClass = 'fa-info-circle'
        iconColor = 'color-blue-light'
    }

    toast.className = `card card-style ${bgColor} shadow-xl mb-3`
    toast.style.animation = 'slideInRight 0.3s ease-out'
    toast.style.marginBottom = '10px'

    toast.innerHTML = `
      <div class="content">
        <div class="d-flex align-items-center">
          <div class="me-3">
            <i class="fa ${iconClass} ${iconColor} fa-lg"></i>
          </div>
          <div class="flex-grow-1">
            <h6 class="mb-1 font-600 color-white">${title}</h6>
            <p class="mb-0 font-11 color-white opacity-80">${message}</p>
          </div>
          <div class="ms-2">
            <a href="#" id="toast-closer-${toastId}" class="color-white opacity-50">
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      </div>
    `

    toastContainer.appendChild(toast)

    const closeHandler = (e: Event) => {
      e.preventDefault()
      removeToast(toastId)
    }

    document.getElementById(`toast-closer-${toastId}`)?.addEventListener('click', closeHandler)
    
    setTimeout(() => removeToast(toastId), duration)
  }, [])

  const removeToast = useCallback((toastId: string) => {
    const toast = document.getElementById(toastId)
    if (toast) {
      toast.style.animation = 'slideOutRight 0.3s ease-in'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }
  }, [])

  return { showToast }
}