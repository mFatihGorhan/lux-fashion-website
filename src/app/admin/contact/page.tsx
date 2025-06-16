'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, User, Calendar, Eye, CheckCircle, Reply, Trash2, Search, Filter } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  isRead: boolean
  isReplied: boolean
  createdAt: string
}

interface ContactResponse {
  contactSubmissions: ContactSubmission[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  counts: {
    total: number
    unread: number
    read: number
    replied: number
  }
}

export default function ContactPage() {
  const [data, setData] = useState<ContactResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [selectedStatus, currentPage])

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/admin/contact?${params}`)
      if (response.ok) {
        const contactData = await response.json()
        setData(contactData)
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, updates: { isRead?: boolean; isReplied?: boolean }) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchContacts()
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, ...updates })
        }
      } else {
        alert('Durum güncellenirken hata oluştu')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Durum güncellenirken hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchContacts()
        if (selectedContact && selectedContact.id === id) {
          setShowModal(false)
          setSelectedContact(null)
        }
      } else {
        alert('Mesaj silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Failed to delete contact:', error)
      alert('Mesaj silinirken hata oluştu')
    }
  }

  const handleViewContact = async (contact: ContactSubmission) => {
    setSelectedContact(contact)
    setShowModal(true)
    
    // Mark as read if not already read
    if (!contact.isRead) {
      await handleStatusChange(contact.id, { isRead: true })
    }
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

  const getStatusBadge = (contact: ContactSubmission) => {
    if (contact.isReplied) {
      return { text: 'Yanıtlandı', color: '#10B981', icon: Reply }
    } else if (contact.isRead) {
      return { text: 'Okundu', color: '#F59E0B', icon: Eye }
    } else {
      return { text: 'Yeni', color: '#EF4444', icon: Mail }
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
        <div>İletişim mesajları yükleniyor...</div>
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
            İletişim Mesajları
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Siteden gelen iletişim formlarını yönetin
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'Tümü', count: data?.counts.total || 0 },
          { key: 'unread', label: 'Yeni', count: data?.counts.unread || 0 },
          { key: 'read', label: 'Okundu', count: data?.counts.read || 0 },
          { key: 'replied', label: 'Yanıtlandı', count: data?.counts.replied || 0 },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => {
              setSelectedStatus(filter.key as any)
              setCurrentPage(1)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: selectedStatus === filter.key ? '#3B82F6' : '#374151',
              color: 'white'
            }}
          >
            <span>{filter.label}</span>
            <span style={{
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              backgroundColor: selectedStatus === filter.key ? 'rgba(255,255,255,0.2)' : '#4B5563'
            }}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contact List */}
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid #374151'
      }}>
        {data?.contactSubmissions.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#9CA3AF' 
          }}>
            Bu filtrede mesaj bulunamadı
          </div>
        ) : (
          <div>
            {data?.contactSubmissions.map((contact, index) => {
              const status = getStatusBadge(contact)
              const StatusIcon = status.icon
              
              return (
                <div
                  key={contact.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    borderBottom: index < (data.contactSubmissions.length - 1) ? '1px solid #374151' : 'none',
                    cursor: 'pointer',
                    backgroundColor: contact.isRead ? '#1F2937' : '#1E3A8A20'
                  }}
                  onClick={() => handleViewContact(contact)}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem'
                  }}>
                    <User size={20} style={{ color: '#9CA3AF' }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      <h3 style={{ 
                        fontWeight: contact.isRead ? 'normal' : 'bold',
                        margin: 0,
                        color: 'white'
                      }}>
                        {contact.name}
                      </h3>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: status.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <StatusIcon size={12} />
                        {status.text}
                      </span>
                    </div>
                    
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#9CA3AF',
                      margin: '0 0 0.25rem 0',
                      fontWeight: contact.isRead ? 'normal' : '500'
                    }}>
                      {contact.subject}
                    </p>
                    
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {contact.message.length > 100 
                        ? contact.message.substring(0, 100) + '...' 
                        : contact.message
                      }
                    </p>
                  </div>

                  {/* Meta */}
                  <div style={{ 
                    textAlign: 'right',
                    color: '#6B7280',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      {formatDate(contact.createdAt)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Mail size={12} />
                      {contact.email}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

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

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
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
            maxWidth: '600px',
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
              <div>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: 'white'
                }}>
                  {selectedContact.name}
                </h2>
                <p style={{ color: '#9CA3AF', margin: 0 }}>
                  {formatDate(selectedContact.createdAt)}
                </p>
              </div>
              
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
                ×
              </button>
            </div>

            {/* Contact Info */}
            <div style={{ 
              display: 'grid', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#9CA3AF'
              }}>
                <Mail size={16} />
                <span>{selectedContact.email}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#9CA3AF'
              }}>
                <Phone size={16} />
                <span>{selectedContact.phone}</span>
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: 'white'
              }}>
                Konu
              </h3>
              <p style={{ color: '#D1D5DB', margin: 0 }}>
                {selectedContact.subject}
              </p>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: 'white'
              }}>
                Mesaj
              </h3>
              <div style={{
                backgroundColor: '#374151',
                borderRadius: '0.5rem',
                padding: '1rem',
                color: '#D1D5DB',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6'
              }}>
                {selectedContact.message}
              </div>
            </div>

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'end',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => handleDelete(selectedContact.id)}
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
              
              {!selectedContact.isReplied && (
                <button
                  onClick={() => handleStatusChange(selectedContact.id, { isReplied: true })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#10B981',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <CheckCircle size={16} />
                  Yanıtlandı Olarak İşaretle
                </button>
              )}
              
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#3B82F6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                <Reply size={16} />
                Email ile Yanıtla
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}