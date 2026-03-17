import { Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'

export function PseScalePopover() {
  const baseStyle = 'h-full size-6 md:size-6 flex items-center justify-center text-center rounded-md font-bold'
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='w-fit flex gap-1 items-center  text-lg md:text-sm underline mt-1 hover:font-semibold'>
          <Info size={18} />
          <p>Ver escala</p>
        </button>
      </PopoverTrigger>
      <PopoverContent className='min-w-72 w-fit text-base md:text-sm'>
        <p className='font-semibold text-lg md:text-base'>
          Escala de Percepção <br />
          Subjetiva de Esforço
        </p>
        <ul className='flex flex-col gap-2 mt-2 p-2'>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'border border-gray-200')}>0</div> • Absolutamente nada
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#B6D5F1] text-white')}>1</div> • Extremamente fraco
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#89CED3] text-white')}>2</div> • Muito fraco
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#30D187] text-white')}>3</div> • Moderado
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#4EDF42] text-gray-900')}>4</div> • Pouco forte
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#BBF31A] text-gray-900')}>5</div> • Forte
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#FFFF00] text-gray-900')}>6</div>
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#FFE700] text-gray-900')}>7</div> • Muito forte
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#FF8900] text-white')}>8</div>
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#FF2F00] text-white')}>9</div>
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#E60000] text-white')}>10</div> • Máximo
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
