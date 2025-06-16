'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  image?: string
  category?: string
  addedAt: string
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
}

type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'TOGGLE_ITEM'; payload: WishlistItem }

interface WishlistContextType extends WishlistState {
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => Promise<void>
  removeFromWishlist: (itemId: string) => Promise<void>
  toggleWishlistItem: (item: Omit<WishlistItem, 'addedAt'>) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (itemId: string) => boolean
  getWishlistCount: () => number
  syncWithServer: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const STORAGE_KEY = 'lux-fashion-wishlist'

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    
    case 'ADD_ITEM':
      if (state.items.some(item => item.id === action.payload.id)) {
        return state // Item already exists
      }
      return { ...state, items: [...state.items, action.payload] }
    
    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: state.items.filter(item => item.id !== action.payload) 
      }
    
    case 'TOGGLE_ITEM':
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id)
      if (existingIndex >= 0) {
        // Remove item
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        }
      } else {
        // Add item
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      }
    
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] }
    
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    isLoading: false,
    error: null
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const items = JSON.parse(stored)
        dispatch({ type: 'SET_ITEMS', payload: items })
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Favori listesi yüklenemedi' })
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Favori listesi kaydedilemedi' })
    }
  }, [state.items])

  const addToWishlist = async (item: Omit<WishlistItem, 'addedAt'>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null })
      
      const wishlistItem: WishlistItem = {
        ...item,
        addedAt: new Date().toISOString()
      }

      dispatch({ type: 'ADD_ITEM', payload: wishlistItem })

      // Sync with server if user is logged in
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: item.id, action: 'add' })
        })
      } catch (error) {
        // Server sync failed, but local storage succeeded
        console.warn('Failed to sync wishlist with server:', error)
      }

    } catch (error) {
      console.error('Failed to add item to wishlist:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Ürün favorilere eklenemedi' })
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'REMOVE_ITEM', payload: itemId })

      // Sync with server if user is logged in
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: itemId, action: 'remove' })
        })
      } catch (error) {
        // Server sync failed, but local storage succeeded
        console.warn('Failed to sync wishlist with server:', error)
      }

    } catch (error) {
      console.error('Failed to remove item from wishlist:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Ürün favorilerden kaldırılamadı' })
    }
  }

  const toggleWishlistItem = async (item: Omit<WishlistItem, 'addedAt'>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null })
      
      const wishlistItem: WishlistItem = {
        ...item,
        addedAt: new Date().toISOString()
      }

      const isCurrentlyInWishlist = state.items.some(existingItem => existingItem.id === item.id)
      dispatch({ type: 'TOGGLE_ITEM', payload: wishlistItem })

      // Sync with server if user is logged in
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            productId: item.id, 
            action: isCurrentlyInWishlist ? 'remove' : 'add'
          })
        })
      } catch (error) {
        // Server sync failed, but local storage succeeded
        console.warn('Failed to sync wishlist with server:', error)
      }

    } catch (error) {
      console.error('Failed to toggle wishlist item:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Favori listesi güncellenemedi' })
    }
  }

  const clearWishlist = async () => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'CLEAR_WISHLIST' })

      // Sync with server if user is logged in
      try {
        await fetch('/api/wishlist', {
          method: 'DELETE'
        })
      } catch (error) {
        console.warn('Failed to sync wishlist clear with server:', error)
      }

    } catch (error) {
      console.error('Failed to clear wishlist:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Favori listesi temizlenemedi' })
    }
  }

  const isInWishlist = (itemId: string): boolean => {
    return state.items.some(item => item.id === itemId)
  }

  const getWishlistCount = (): number => {
    return state.items.length
  }

  const syncWithServer = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const serverWishlist = await response.json()
        
        // Merge server wishlist with local storage
        // For simplicity, server takes precedence
        if (Array.isArray(serverWishlist.items)) {
          dispatch({ type: 'SET_ITEMS', payload: serverWishlist.items })
        }
      }
    } catch (error) {
      console.error('Failed to sync with server:', error)
      // Don't show error to user as this is background sync
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const value: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    syncWithServer
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

// Custom hook for wishlist item status
export function useWishlistItem(itemId: string) {
  const { isInWishlist, addToWishlist, removeFromWishlist, toggleWishlistItem } = useWishlist()
  
  return {
    isInWishlist: isInWishlist(itemId),
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem
  }
}