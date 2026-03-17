import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  firstDayOfWeek: Date
  lastDayOfWeek: Date
  handler: {
    previous(): void
    next(): void
  }
}

export function WeekNavigator({ firstDayOfWeek, lastDayOfWeek, handler }: Props) {
  return (
    <div className='w-full lg:w-fit flex items-center gap-4 bg-muted text-foreground py-1 px-2 rounded-full h-fit text-sm'>
      <button className='print:hidden p-1 rounded-full bg-background text-foreground  hover:brightness-90' onClick={handler.previous}>
        <ArrowLeft size={16} />
      </button>
      <span className='w-full text-center'>
        {firstDayOfWeek.toLocaleDateString('pt-BR')} - {lastDayOfWeek.toLocaleDateString('pt-BR')}
      </span>
      <button className='print:hidden p-1 rounded-full bg-background text-foreground  hover:brightness-90' onClick={handler.next}>
        <ArrowRight size={16} />
      </button>
    </div>
  )
}