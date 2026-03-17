import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn, masker } from '@/lib'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string
}

/**
 * @prop mask: exemplo: "(99) 99999-9999" ou "999.999.999-99"
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, mask, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [{ showPassword }, setState] = React.useState({ showPassword: false })

  function mergedRef(node: HTMLInputElement) {
    inputRef.current = node

    if (typeof ref === 'function') {
      ref(node)
      return
    }

    if (ref) {
      ref.current = node
    }
  }

  function applyMask() {
    if (!inputRef.current || !mask || inputRef.current.type === 'time') return;

    masker(inputRef.current).unMask();
    masker(inputRef.current).maskPattern(mask);
  }

  const styles = cn(
    'flex h-12 md:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 justify-center',
    className
  )

  function toggleShowPassword() {
    setState((old) => ({ showPassword: !old.showPassword }))
  }

  React.useEffect(() => {
    applyMask()
  }, [mask])

  if (type === 'password') {
    const currentType = showPassword ? 'text' : type
    return (
      <div className='flex gap-4 items-center relative'>
        <input type={currentType} className={styles} ref={mergedRef} {...props} />
        <button
          type='button'
          className='absolute right-2 p-0.5 pl-2 bg-inherit border-l text-muted-foreground hover:text-primary-dark'
          onClick={toggleShowPassword}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    )
  }

  return <input type={type} className={styles} ref={mergedRef} {...props} />
})

Input.displayName = 'Input'

export { Input }
