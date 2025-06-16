'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Image as ImageIcon, Trash2, Eye, Search, Filter, Grid, List, X, Copy, Check } from 'lucide-react'

interface Media {
  id: string
  url: string
  fileName: string
  fileSize: number
  fileType: string
  width: number | null
  height: number | null
  alt: string
  caption: string
  createdAt: string
}

interface MediaResponse {
  mediaFiles: Media[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function MediaPage() {
  const [data, setData] = useState<MediaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [currentPage])

  const fetchMedia = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        type: 'image'
      })

      const response = await fetch(`/api/admin/media?${params}`)
      if (response.ok) {
        const mediaData = await response.json()
        setData(mediaData)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', file.name.split('.')[0])

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          alert(`Dosya yüklenirken hata: ${error.error}`)
        }
      }

      await fetchMedia()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Dosya yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length) {
      handleFileUpload(files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = async (url: string) => {
    const fullUrl = `${window.location.origin}${url}`
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu medyayı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMedia()
        if (selectedMedia && selectedMedia.id === id) {
          setShowModal(false)
          setSelectedMedia(null)
        }
      } else {
        alert('Medya silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Medya silinirken hata oluştu')
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: 'white'
      }}>
        <div>Medya dosyaları yükleniyor...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            Medya Yönetimi
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Görsel dosyalarınızı yükleyin ve yönetin
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', backgroundColor: '#374151', borderRadius: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? '#3B82F6' : 'transparent',
                color: 'white',
                borderRadius: '0.5rem 0 0 0.5rem',
                cursor: 'pointer'
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: viewMode === 'list' ? '#3B82F6' : 'transparent',
                color: 'white',
                borderRadius: '0 0.5rem 0.5rem 0',
                cursor: 'pointer'
              }}
            >
              <List size={16} />
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: uploading ? '#6B7280' : '#3B82F6',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            <Upload size={16} />
            {uploading ? 'Yükleniyor...' : 'Dosya Yükle'}
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: '2px dashed #374151',
          borderRadius: '0.75rem',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          backgroundColor: '#1F2937',
          cursor: 'pointer'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={48} style={{ color: '#6B7280', margin: '0 auto 1rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#D1D5DB' }}>
          Dosyaları buraya sürükleyin veya tıklayın
        </h3>
        <p style={{ color: '#9CA3AF', margin: 0 }}>
          PNG, JPG, GIF dosyaları desteklenir (Max. 5MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        style={{ display: 'none' }}
      />

      {/* Media Grid/List */}
      {data?.mediaFiles.length === 0 ? (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          color: '#9CA3AF',
          backgroundColor: '#1F2937',
          borderRadius: '0.75rem'
        }}>
          Henüz medya dosyası yüklenmemiş
        </div>
      ) : (
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : undefined,
          flexDirection: viewMode === 'list' ? 'column' : undefined,
          gap: '1rem'
        }}>
          {data?.mediaFiles.map((media) => (
            <div
              key={media.id}
              style={{
                backgroundColor: '#1F2937',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: '1px solid #374151',
                cursor: 'pointer',
                display: viewMode === 'list' ? 'flex' : 'block',
                alignItems: viewMode === 'list' ? 'center' : undefined,
                padding: viewMode === 'list' ? '1rem' : undefined
              }}
              onClick={() => {
                setSelectedMedia(media)
                setShowModal(true)
              }}
            >
              {/* Image */}
              <div style={{
                width: viewMode === 'list' ? '80px' : '100%',
                height: viewMode === 'list' ? '80px' : '150px',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: viewMode === 'list' ? '0.5rem' : '0',
                marginRight: viewMode === 'list' ? '1rem' : '0',
                flexShrink: 0
              }}>
                <img
                  src={media.url}
                  alt={media.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ 
                padding: viewMode === 'grid' ? '1rem' : '0',
                flex: viewMode === 'list' ? 1 : undefined
              }}>
                <h3 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  margin: '0 0 0.5rem 0',
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {media.fileName}
                </h3>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#9CA3AF', 
                  margin: '0 0 0.25rem 0' 
                }}>
                  {formatFileSize(media.fileSize)}
                </p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6B7280', 
                  margin: 0 
                }}>
                  {formatDate(media.createdAt)}
                </p>
              </div>

              {/* Actions */}
              {viewMode === 'list' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(media.url)
                    }}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: copiedUrl === media.url ? '#10B981' : '#374151',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedUrl === media.url ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(media.id)
                    }}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#EF4444',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentPage === page ? '#3B82F6' : '#374151',
                color: 'white'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Media Detail Modal */}
      {showModal && selectedMedia && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1F2937',
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #374151'
          }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'start',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                margin: 0,
                color: 'white'
              }}>
                {selectedMedia.fileName}
              </h2>
              
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  fontSize: '1.5rem'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Image Preview */}
            <div style={{
              backgroundColor: '#374151',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <img
                src={selectedMedia.url}
                alt={selectedMedia.alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: '0.375rem'
                }}
              />
            </div>

            {/* File Info */}
            <div style={{ 
              display: 'grid', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#D1D5DB' }}>
                  Dosya URL
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={`${window.location.origin}${selectedMedia.url}`}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.375rem',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button
                    onClick={() => copyToClipboard(selectedMedia.url)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: copiedUrl === selectedMedia.url ? '#10B981' : '#3B82F6',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedUrl === selectedMedia.url ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#D1D5DB' }}>
                    Dosya Boyutu
                  </h3>
                  <p style={{ color: '#9CA3AF', margin: 0 }}>
                    {formatFileSize(selectedMedia.fileSize)}
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#D1D5DB' }}>
                    Dosya Türü
                  </h3>
                  <p style={{ color: '#9CA3AF', margin: 0 }}>
                    {selectedMedia.fileType}
                  </p>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#D1D5DB' }}>
                  Yüklenme Tarihi
                </h3>
                <p style={{ color: '#9CA3AF', margin: 0 }}>
                  {formatDate(selectedMedia.createdAt)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'end'
            }}>
              <button
                onClick={() => handleDelete(selectedMedia.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#EF4444',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <Trash2 size={16} />
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}