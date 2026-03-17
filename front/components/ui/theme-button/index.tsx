'use client'

import { Fragment, type ButtonHTMLAttributes } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  onlyIcon?: boolean
}

export function ThemeButton({ className, onlyIcon = false, ...props}: Props) {
  const { systemTheme, theme, setTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme

  const isDark = currentTheme === 'dark'

  const style = {
    icons: 'w-5 h-5 text-foreground',
  }

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn('transition-all duration-200 dark:text-foreground flex gap-1 w-fit h-auto', className)}
      aria-label='Toggle Theme'
      {...props}
    >
      {isDark ? (
        <Fragment>
          <Sun className={style.icons} />
         {!onlyIcon && 'Luz do dia'}
        </Fragment>
      ) : (
        <Fragment>
          <Moon className={style.icons} />
          {!onlyIcon && 'Modo noturno'}
        </Fragment>
      )}
    </button>
  )
}
