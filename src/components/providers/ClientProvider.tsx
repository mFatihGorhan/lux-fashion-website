'use client'

import { useEffect, useState } from 'react'

interface ClientProviderProps {
  children: React.ReactNode
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}