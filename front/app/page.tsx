import Link from 'next/link'
import Image from 'next/image'
import { Activity, Calendar, Trophy } from 'lucide-react'
import { Button, DailyDurationChart, DailyLoadChart, Footer, Logo, WeekLoadChart } from '@/components/ui'
import { generateRandomNumbersArray } from '@/lib/utils'
import { RouteEnum } from '@/enums'

export default function Home() {
  return (
    <main className='w-full min-h-screen h-full text-balance'>
      <header className='w-full flex px-16 py-8 justify-center md:justify-between border-b border-input'>
        <Logo />
        <div className='hidden md:flex gap-6'>
          <Link href={RouteEnum.REGISTER}>
            <Button className='hidden' variant='outline'>
              Criar Conta
            </Button>
          </Link>
          <Link href={RouteEnum.LOGIN}>
            <Button>Entrar</Button>
          </Link>
        </div>
      </header>
      <div className='w-full flex flex-col items-center gap-20 justify-center mt-[16vh] px-4 md:px-16'>
        <div className='w-full flex flex-col items-center gap-16 justify-center px-14'>
          <Image src='/logo.svg' alt='Training Track Logo' width={340} height={276} priority />
          <div className='w-full flex flex-col items-center gap-4'>
            <Link href={RouteEnum.REGISTER}>
              <Button className='px-10 hidden'>Criar Conta</Button>
            </Link>
            <Link href={RouteEnum.LOGIN}>
              <Button variant='link' className='flex md:hidden px-10 underline'>
                Entrar
              </Button>
            </Link>
          </div>
        </div>
        <Image src='/banner.svg' alt='Training Track Banner' width={1200} height={777} priority />
      </div>
      <div className='w-full flex mt-12 gap-4 justify-around flex-wrap bg-primary-medium p-8 py-12 md:px-12 text-background text-xl md:text-2xl font-semibold  divide-background'>
        <span className='w-full md:w-fit flex justify-around gap-4 md:gap-12 items-center '>
          <h1>Planeje</h1>
          <Calendar className='size-12 md:size-16 lg:size-20' />
        </span>
        <span className='w-full md:w-fit flex justify-around gap-4 md:gap-12 items-center'>
          <h1>Execute</h1>
          <Trophy className='size-12 md:size-16 lg:size-20' />
        </span>
        <span className='w-full md:w-fit flex justify-around gap-4 md:gap-12 items-center'>
          <h1>Monitore</h1>
          <Activity className='size-12 md:size-16 lg:size-20' />
        </span>
      </div>
      <article className='w-full h-full flex flex-col gap-4 text-primary-night py-12 md:px-12 p-8 font-medium text-xl'>
        <h2 className='w-full text-center font-bold'>
          Tenha acesso ao painel de controle da <span className='text-primary-medium'>Carga Diária de Treinamento</span>
          .
        </h2>
        <p className='text-lg text-center text-balance text-zinc-600'>
          A carga diária é composta pela soma das cargas de cada sessão ao longo do dia. Para calcular a carga de cada
          sessão, é utilizado as variáveis de <strong>duração total do treino</strong>, vezes a{' '}
          <strong>Percepção Subjetiva de Esforço (PSE)</strong> que será respondida pelo seu atleta.
        </p>
        <DailyLoadChart
          labels={['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']}
          performedTraining={generateRandomNumbersArray()}
          plannedTraining={generateRandomNumbersArray()}
          pse={generateRandomNumbersArray(7, 0, 10)}
          psr={generateRandomNumbersArray(7, 0, 10)}
        />
      </article>
      <article className='w-full h-full flex flex-col bg-primary gap-8 text-background py-12 md:px-12 p-8 font-medium text-xl'>
        <h2 className='w-full text-center font-semibold'>
          Compare a <span className='font-bold text-primary-dark'>Duração Total do Treino</span> x
          <span className='font-bold text-primary-dark'> PSE</span>.
        </h2>
        <p className='text-lg text-center text-balance text-background'>
          Compare individualmente se seus atletas atingem o
          <span className='font-semibold text-primary-dark'> tempo</span> planejado para cada sessão de treinamento, bem
          como se os <span className='font-semibold text-primary-dark'>esforços</span> esperados por você, também estão
          sendo percebidos por eles.
        </p>
        <span className='bg-background text-primary-night rounded-md'>
          <DailyDurationChart
            labels={['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']}
            pse={generateRandomNumbersArray(7, 0, 10)}
            plannedPse={generateRandomNumbersArray(7, 0, 10)}
            duration={generateRandomNumbersArray(7, 0, 60)}
            plannedDuration={generateRandomNumbersArray(7, 0, 60)}
          />
        </span>
      </article>
      <article className='w-full h-full flex flex-col gap-4 text-primary-night py-12 p-8 md:px-12 font-medium text-xl'>
        <h2 className='w-full text-center font-bold'>
          Total controle sobre a <span className='text-primary-medium'>Carga da Semana</span>.
        </h2>
        <p className='text-lg text-center text-balance text-zinc-600'>
          Resultado da soma das cargas diárias, ao ser monitorada ao longo de um período, possibilita análise de indices
          de <span className='text-primary-medium font-bold'>monotonia</span> entre a relação das cargas de treinamento,
          assim como auxilia na identificação de altos níveis de{' '}
          <span className='text-primary-medium font-bold'>tensão</span> entre uma semana e outra, alertando sobre
          atletas que se encontram em uma
          <span className='text-primary-dark font-semibold'> zona de risco de lesão</span>.
        </p>
        <WeekLoadChart
          week={['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']}
          acuteChronicLoadRatio={generateRandomNumbersArray(4, 0, 4)}
          load={{
            performed: generateRandomNumbersArray(4, 0, 1000),
            planned: generateRandomNumbersArray(4, 0, 1000),
          }}
          monotony={generateRandomNumbersArray(4, 0, 2)}
          strain={generateRandomNumbersArray(4, 0, 3000)}
        />
      </article>
      <Footer />
    </main>
  )
}
