'use client'

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Bar,
  Tooltip as TooltipChart,
} from 'recharts'
import { ChartWrapper } from './wrapper'
import { useState, useMemo, HTMLAttributes } from 'react'
import { MultiSelect } from '../multi-select'
import clsx from 'clsx'
import { Angry, Annoyed, Frown, Info, Laugh, Smile } from 'lucide-react'
import { Badge } from '../badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'

interface Props {
  labels: string[]
  pain: number[]
  humor: number[]
  stress: number[]
  fatigue: number[]
  energy: number[]
  nutrition: number[]
  motivation: number[]
  sleep: number[]
  sleepHours: number[]
  waterIntake: number[]
  isLoading?: boolean
}

const seriesOptions = [
  { label: 'Dor Muscular', value: 'Dor' },
  { label: 'Stress', value: 'Stress' },
  { label: 'Humor', value: 'Humor' },
  { label: 'Fadiga', value: 'Fadiga' },
  { label: 'Energia', value: 'Energia' },
  { label: 'Motivação', value: 'Motivação' },
  { label: 'Alimentação', value: 'Alimentação' },
  { label: 'Noite de Sono', value: 'Noite de Sono' },
  { label: 'Horas de Sono', value: 'Horas de Sono' },
  { label: 'Água ingerida', value: 'Água ingerida' },
]

export const wellBeingDisplayLabels = {
  pain: 'Dor',
  energy: 'Energia',
  humor: 'Humor',
  stress: 'Stress',
  sleep: 'Noite de Sono',
  sleepHours: 'Horas de Sono',
  nutrition: 'Alimentação',
  waterIntake: 'Água ingerida',
  motivation: 'Motivação',
  fatigue: 'Fadiga',
}

const chartColors: Record<string, string> = {
  Dor: '#EF4444',
  Stress: '#F59E0B',
  Humor: '#3B82F6',
  Fadiga: '#FFEE00',
  Energia: '#10B981',
  Motivação: '#6366F1',
  Alimentação: '#EC4899',
  'Noite de Sono': '#14B8A6',
  'Horas de Sono': '#8B5CF6',
  'Água ingerida': '#0EA5E9',
}

export function WellBeingChart({
  labels = [],
  pain = [],
  fatigue = [],
  humor = [],
  stress = [],
  sleep = [],
  energy = [],
  motivation = [],
  nutrition = [],
  sleepHours = [],
  waterIntake = [],
  isLoading = false,
}: Props) {
  const [selectedKeys, setSelectedKeys] = useState(seriesOptions.map((opt) => opt.value))

  const { chart, summary } = useMemo(() => {
    const chart = labels.map((label, index) => ({
      name: label,
      [wellBeingDisplayLabels.pain]: pain?.[index] ?? 0,
      [wellBeingDisplayLabels.fatigue]: fatigue?.[index] ?? 0,
      [wellBeingDisplayLabels.humor]: humor?.[index] ?? 0,
      [wellBeingDisplayLabels.stress]: stress?.[index] ?? 0,
      [wellBeingDisplayLabels.sleep]: sleep?.[index] ?? 0,
      [wellBeingDisplayLabels.energy]: energy?.[index] ?? 0,
      [wellBeingDisplayLabels.motivation]: motivation?.[index] ?? 0,
      [wellBeingDisplayLabels.nutrition]: nutrition?.[index] ?? 0,
      [wellBeingDisplayLabels.sleepHours]: sleepHours?.[index] ?? 0,
      [wellBeingDisplayLabels.waterIntake]: waterIntake?.[index] ?? 0,
    }))

    const summaryCount = labels.reduce(
      (acc, _, index) => {
        acc.pain += pain[index]
        acc.fatigue += fatigue[index]
        acc.humor += humor[index]
        acc.stress += stress[index]
        acc.sleep += sleep[index]
        acc.energy += energy[index]
        acc.motivation += motivation[index]
        acc.nutrition += nutrition[index]
        acc.sleepHours += sleepHours[index]
        acc.waterIntake += waterIntake[index]
        return acc
      },
      {
        sleep: 0,
        energy: 0,
        pain: 0,
        stress: 0,
        humor: 0,
        nutrition: 0,
        motivation: 0,
        fatigue: 0,
        sleepHours: 0,
        waterIntake: 0,
      }
    )

    const daysCaptured = pain.filter((value) => !!value)

    const summary = Object.entries(wellBeingDisplayLabels).map(([key, title]) => ({
      title,
      value: Math.round(summaryCount[key as keyof typeof summaryCount] / daysCaptured.length),
    }))

    return {
      chart,
      summary,
    }
  }, [labels, pain, fatigue, humor, stress, sleep, energy, motivation, nutrition, sleepHours, waterIntake])

  const styles = {
    axis: {
      fontSize: 14,
    },
  }

  return (
    <ChartWrapper
      isLoading={isLoading}
      titleComponent={
        <div className='flex items-center justify-between w-full flex-wrap gap-2'>
          <span className='py-4 flex gap-2 items-center'>
            🧘 Monitoramento de Bem-Estar
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className='size-5' />
                </TooltipTrigger>
                <TooltipContent>
                  <div className='flex flex-col gap-2'>
                    <p className='font-semibold'>Legenda</p>
                    <div className='flex items-center gap-2'>
                      <div className='text-blue-500'>5</div>
                      <span>Excelente</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='text-emerald-600'>4</div>
                      <span>Boa</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='text-yellow-500'>3</div>
                      <span>Normal</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='text-orange-400'>2</div>
                      <span>Ruim</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='text-red-500'>1</div>
                      <span>Muito ruim</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <MultiSelect options={seriesOptions} selected={selectedKeys} onChange={setSelectedKeys} />
        </div>
      }
      className='print:mt-16'
    >
      <ResponsiveContainer width='100%' height={Math.max(labels.length * 50, 400)}>
        <BarChart data={chart} layout='vertical'>
          <CartesianGrid strokeDasharray='3 3' stroke='hsla(var(--muted))' style={styles.axis} />
          <XAxis type='number' stroke='#9CA3AF' style={styles.axis} />
          <YAxis dataKey='name' type='category' stroke='#9CA3AF' style={styles.axis} width={120} />
          <TooltipChart
            contentStyle={{
              backgroundColor: 'hsla(var(--background))',
              borderColor: 'hsla(var(--border))',
              color: 'hsla(var(--foreground))',
            }}
            labelStyle={{ color: 'hsla(var(--primary))' }}
            itemStyle={{ color: 'hsla(var(--foreground))' }}
            cursor={{ fill: 'hsla(var(--muted))' }}
          />
          <Legend wrapperStyle={{ color: '#6B7280' }} />

          {seriesOptions.map(({ value }) =>
            selectedKeys.includes(value) ? (
              <Bar key={value} dataKey={value} stackId='a' fill={chartColors[value]} />
            ) : null
          )}
        </BarChart>
      </ResponsiveContainer>
      <div className='h-[1px] border border-border w-fill my-4' />
      <p className='text-xl font-semibold leading-none tracking-tight pt-4'>Média da semana</p>
      <WellBeingSummary summary={summary} />
    </ChartWrapper>
  )
}

const moodIcons: Record<number, { icon: JSX.Element; label: string }> = {
  1: {
    icon: <Angry className='size-8 md:size-5 text-foreground' />,
    label: 'Péssima',
  },
  2: {
    icon: <Frown className='size-8 md:size-5 text-foreground' />,
    label: 'Ruim',
  },
  3: {
    icon: <Annoyed className='size-8 md:size-5 text-foreground' />,
    label: 'Normal',
  },
  4: {
    icon: <Smile className='size-8 md:size-5 text-foreground' />,
    label: 'Boa',
  },
  5: {
    icon: <Laugh className='size-8 md:size-5 text-foreground' />,
    label: 'Ótima',
  },
}

export function WellBeingSummary({
  summary,
  className,
}: {
  summary: { title: string; value: number }[]
  className?: HTMLAttributes<'Div'>['className']
}) {
  if (!summary.length)
    return (
      <Badge className='w-fit h-min bg-muted text-foreground hover:bg-muted'>Dados de bem-estar não informados</Badge>
    )

  return (
    <div className={className ?? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-4'}>
      {summary.map(({ title, value = 0 }) => {
        const getValue = () => {
          if (title === wellBeingDisplayLabels.sleepHours || title === wellBeingDisplayLabels.waterIntake)
            return Math.round(value + 1)

          return Math.round(value)
        }

        const rounded = Math.round(getValue())
        const mood = moodIcons[rounded] ?? moodIcons[3] // fallback para "Normal"

        const displayValue = () => {
          if (title === wellBeingDisplayLabels.sleepHours)
            return ['', 'Menos de 5h', '5-6h', '7-8h', 'Mais de 8h'][value]

          if (title === wellBeingDisplayLabels.waterIntake)
            return ['', 'Menos de 1L', '1-2L', '2-3L', 'Mais de 3L'][value]

          return (value ?? 0).toFixed(1)
        }

        return (
          <div key={title} className={clsx('rounded-xl border p-3 text-center shadow-sm bg-muted text-foreground')}>
            <div className='flex flex-col md:flex-row justify-center items-center gap-1 text-lg font-semibold'>
              {mood.icon}
              {title}
            </div>
            <div className='text-2xl font-bold'>{!!value ? displayValue() : '-'}</div>
            <div className='text-sm'>{mood.label}</div>
          </div>
        )
      })}
    </div>
  )
}
