'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './SearchBox.module.css'

interface SearchSuggestion {
  id: number
  name: string
  slug: string
  category: string
}

interface SearchBoxProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export default function SearchBox({ 
  placeholder = "Ürün ara...", 
  onSearch,
  className = ""
}: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Fetch suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
          setIsOpen(data.length > 0)
        }
      } catch (error) {
        console.error('Search suggestions error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query)
    }
  }

  const performSearch = (searchQuery: string) => {
    setIsOpen(false)
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/urunler?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name)
    setIsOpen(false)
    router.push(`/urun/${suggestion.slug}`)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className={`${styles.searchBox} ${className}`}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={styles.searchInput}
            onFocus={() => query.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className={styles.clearButton}
              aria-label="Aramayı temizle"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className={styles.suggestionsDropdown}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <span>Aranıyor...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={styles.suggestionItem}
                >
                  <div className={styles.suggestionContent}>
                    <span className={styles.suggestionName}>{suggestion.name}</span>
                    <span className={styles.suggestionCategory}>{suggestion.category}</span>
                  </div>
                </button>
              ))}
              <div className={styles.searchAllOption}>
                <button
                  onClick={() => performSearch(query)}
                  className={styles.searchAllButton}
                >
                  <Search size={16} />
                  <span>"{query}" için tüm sonuçları göster</span>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              <span>"{query}" için sonuç bulunamadı</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}