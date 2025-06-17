'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import adminStyles from '@/styles/admin/admin.module.css'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  label?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  label = "Görsel Yükle",
  accept = "image/*",
  maxSize = 5,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece görsel dosyası seçin')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Dosya boyutu ${maxSize}MB'dan küçük olmalıdır`)
      return
    }

    setUploading(true)

    try {
      // Upload to local storage or convert to base64
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
      } else {
        // Fallback to base64 if upload API fails
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error('Upload error:', error)
      // Fallback to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    } else {
      onChange('')
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`${adminStyles.formGroup} ${className}`}>
      {label && <label className={adminStyles.label}>{label}</label>}
      
      {value ? (
        <div className={adminStyles.imagePreview}>
          <img src={value} alt="Preview" />
          <button
            type="button"
            onClick={handleRemove}
            className={adminStyles.removeImage}
            title="Görseli kaldır"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          className={`${adminStyles.fileButton} ${dragActive ? 'border-blue-400 bg-blue-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className={adminStyles.fileInput}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              <span>Yükleniyor...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={32} className="text-gray-400" />
              <div className="text-center">
                <p className="font-medium">Görsel yüklemek için tıklayın</p>
                <p className="text-sm text-gray-500 mt-1">
                  veya dosyayı buraya sürükleyin
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG, GIF - Maksimum {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageUpload