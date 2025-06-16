'use client'

import { useEffect, useState } from 'react'
import WhatsAppButton from './WhatsAppButton'

const WhatsAppButtonWrapper = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <WhatsAppButton />
}

export default WhatsAppButtonWrapper
