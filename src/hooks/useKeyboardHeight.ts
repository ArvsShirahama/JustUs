import { useState, useEffect } from 'react'

export function useKeyboardHeight() {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const visualHeight = window.visualViewport?.height ?? window.innerHeight
      const diff = window.innerHeight - visualHeight
      setHeight(Math.max(0, diff))
    }

    window.visualViewport?.addEventListener('resize', handleResize)
    return () =>
      window.visualViewport?.removeEventListener('resize', handleResize)
  }, [])

  return height
}
