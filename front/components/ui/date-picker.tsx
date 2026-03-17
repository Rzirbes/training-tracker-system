'use client'

import { useState } from 'react'
import { Control } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import 'react-day-picker/dist/style.css'

interface Props {
  label: string
  name: string
  control: Control<any, any>
  description?: string
  disabled?(date: Date): boolean
  isDisabled?: boolean
  autoFocus?: boolean
}

export function DatePicker({
  control,
  label,
  name,
  description,
  isDisabled,
  autoFocus = false,
  disabled = () => false,
}: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const closePopover = () => setIsPopoverOpen(false)

  return (
    <FormField
      disabled={isDisabled}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-1 flex flex-col'>
          <FormLabel className='mt-1.5'>{label}</FormLabel>
          <Popover modal={true} open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  ref={field.ref}
                  autoFocus={autoFocus}
                  disabled={isDisabled}
                  variant='outline'
                  className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? (
                    format(field.value, 'PPP', { locale: ptBR })
                  ) : (
                    <span className='text-lg md:text-sm'>Selecione a data</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                locale={ptBR}
                defaultMonth={field.value}
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  closePopover()
                }}
                disabled={(date) => date < new Date('1900-01-01') || disabled?.(date)}
                initialFocus={autoFocus}
                fromYear={1910}
                toYear={2100}
                captionLayout='dropdown-buttons'
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
