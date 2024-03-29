'use client'

import { DynamicToast } from '@/components'
import useToastHandler from '@/hooks/useToastHandler'
import { createContext, useContext, useState } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'

export type TThemeContext = {
  themeHandler: {
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
  }
  toastHandler: ReturnType<typeof useToastHandler>
}

const ThemeContext = createContext({} as TThemeContext)

export default function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme: 'light' | 'dark'
}) {
  const toastHandler = useToastHandler()
  const [theme, setTheme] = useState(initialTheme)

  // CONTEXT
  //==============================================
  const contextData: TThemeContext = {
    themeHandler: {
      theme,
      setTheme,
    },
    toastHandler: toastHandler,
  }

  return (
    <ThemeContext.Provider value={contextData}>
      <div className="logo-container absolute top-5 left-1/2 transform -translate-x-1/2 md:left-10 md:translate-x-0 z-10">
        <NextLink
          rel="no-referrer"
          href="https://bloomnetwork.earth"
          target="_blank"
        >
          <Image
            priority
            src="/bloom-bounties-small.svg"
            alt="bloom_logo"
            width={220}
            height={130}
          />
        </NextLink>
      </div>
      <div className="mt-4">{children}</div>
      <DynamicToast {...toastHandler} />
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)
