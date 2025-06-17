'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import styles from './Toast.module.css'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id?: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  
  const Icon = iconMap[type]

  useEffect(() => {
    // Trigger animation
    setIsVisible(true)

    // Auto-remove after duration
    if (duration > 0) {
      const removeTimer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(removeTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onClose?.()
    }, 300) // Match animation duration
  }

  return (
    <div 
      className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : ''} ${isRemoving ? styles.removing : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.iconContainer}>
        <Icon size={20} className={styles.icon} />
      </div>
      
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        {message && <p className={styles.message}>{message}</p>}
      </div>
      
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Bildirimi kapat"
      >
        <X size={16} />
      </button>
      
      {/* Progress bar for duration */}
      {duration > 0 && (
        <div 
          className={styles.progressBar}
          style={{
            animationDuration: `${duration}ms`
          }}
        />
      )}
    </div>
  )
}

export default Toast

// Toast Container for managing multiple toasts
export interface ToastData extends Omit<ToastProps, 'onClose'> {
  id: string
}

interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right'
}) => {
  if (toasts.length === 0) return null

  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

// Hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }

  const warning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }

  const info = (title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}