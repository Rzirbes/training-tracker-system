import { Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'

export function PsrScalePopover() {
  const baseStyle = 'h-full size-6 md:size-6 flex items-center justify-center text-center rounded-md font-bold'
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='w-fit flex gap-1 items-center  text-lg md:text-sm underline mt-1 hover:font-semibold'>
          <Info size={18} />
          <p>Ver escala</p>
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-fit text-base md:text-sm'>
        <p className='font-semibold text-lg md:text-base'>
          Escala de Percepção <br />
          Subjetiva de Recuperação
        </p>
        <ul className='flex flex-col gap-2 mt-2 p-2'>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'border border-gray-200')}>0</div>• Nenhuma recuperação
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#f0f3fa] text-gray-900')}>1</div>• Muito pouco recuperado
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#E1EAF7] text-gray-900')}>2</div>• Pouco recuperado
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#E2EAF7] text-gray-900')}>3</div>• Recuperação moderada
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#D0DEF3] text-gray-900')}>4</div>• Boa recuperação
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#C8D9F1] text-gray-900')}>5</div>• Recuperação muito boa
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#B0CAEC] text-white')}>6</div>
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#98BBE7] text-white')}>7</div>• Recuperação extremamente boa
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#81AFE4] text-white')}>8</div>
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#6BA5E1] text-white')}>9</div>
          </li>
          <li className='flex gap-2'>
            <div className={cn(baseStyle, 'bg-[#5C9FDF] text-white')}>10</div>• Recuperado
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
