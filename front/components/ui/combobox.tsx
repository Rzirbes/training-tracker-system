'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from '@/components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Option {
  label: string
  value: string
}

interface ComboboxProps {
  options: Option[]
  placeholder?: string
  onSelect?: (value: string) => void
  value?: string
  className?: string
}

const TRIGGER_ID = 'combobox-trigger'

export function Combobox({ options, placeholder = 'Selecione uma opção', onSelect, value, className }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value || '')

  const selectedLabel = options.find((opt) => opt.value === selected)?.label

  const handleSelect = (currentValue: string) => {
    setSelected(currentValue)
    onSelect?.(currentValue)
    setOpen(false)
  }

  const getMaxWidth = () => {
    if (!document) return
    const element = document.getElementById(TRIGGER_ID)
    return element?.clientWidth
  }

  useEffect(() => {
    if (value) {
      setSelected(value)
    }
  }, [value])

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={TRIGGER_ID}
          type='button'
          role='combobox'
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full h-10 px-3 py-2 text-left text-sm rounded-md border border-input bg-background shadow-sm focus:outline-none',
            className
          )}
        >
          {selectedLabel || <span className='text-muted-foreground'>{placeholder}</span>}
        </button>
      </PopoverTrigger>

      <PopoverContent className='min-w-full p-0 mt-1' align='start' sideOffset={4} style={{ width: getMaxWidth() }}>
        <Command>
          <CommandInput placeholder='Digite para filtrar...' />
          <CommandList>
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.value} onSelect={() => handleSelect(opt.value)}>
                  {opt.label}
                  <Check className={cn('ml-auto h-4 w-4', selected === opt.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
