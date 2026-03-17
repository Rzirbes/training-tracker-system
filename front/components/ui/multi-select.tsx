'use client'

import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface MultiSelectProps {
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  showActionButtons?: boolean
  className?: {
    trigger?: string
  }
}

export function MultiSelect({
  options = [],
  selected,
  onChange,
  placeholder = 'Filtro',
  className,
  disabled,
  showActionButtons = true,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const removeAll = () => {
    onChange([])
  }

  const selectAll = () => {
    onChange(options.map(({ value }) => value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant='outline'
          size='sm'
          className={cn('h-12 md:h-10 w-full md:w-fit justify-between', className?.trigger)}
        >
          {placeholder}
          <ChevronDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='min-w-[var(--radix-popover-trigger-width)] w-full md:w-auto p-0 border border-muted bg-popover text-popover-foreground shadow-md rounded-md'>
        <Command>
          {showActionButtons && (
            <CommandGroup>
              <div className='flex justify-around gap-1'>
                <CommandItem className='cursor-pointer' onSelect={selectAll}>
                  Selecionar todos
                </CommandItem>
                <CommandItem className='cursor-pointer' onSelect={removeAll}>
                  Remover todos
                </CommandItem>
              </div>
            </CommandGroup>
          )}
          <CommandGroup className='overflow-y-auto max-h-60'>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleValue(option.value)}
                className='cursor-pointer text-lg md:text-sm'
              >
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    selected.includes(option.value) ? 'bg-primary text-primary-foreground' : 'opacity-50'
                  )}
                >
                  {selected.includes(option.value) && <Check className='h-4 w-4' />}
                </div>
                {option.label}
              </CommandItem>
            ))}
            {!options.length && (
              <CommandItem disabled className='cursor-pointer text-lg md:text-sm'>
                Sem dados
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
