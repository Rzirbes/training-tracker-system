'use client'

import { useEffect, useState } from 'react'

export function useScreenDetector() {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth)
    }

    handleWindowSizeChange()

    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const isMobile = width !== null && width <= 768
  const isTablet = width !== null && width <= 1024
  const isDesktop = width !== null && width > 1280

  return { isMobile, isTablet, isDesktop }
}
