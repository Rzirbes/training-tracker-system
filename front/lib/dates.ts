export function getCurrentWeekDates(): Date[] {
  const currentDate = new Date()
  const currentDayOfWeek = currentDate.getDay() // 0 (Sunday) to 6 (Saturday)

  // Start from Sunday
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek)

  const weekDates: Date[] = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    weekDates.push(date)
  }

  return weekDates
}

export function getWeekDatesFromInput(weekString: string): Date[] {
  const [year, week] = weekString.split('-W').map(Number)

  // Cria um objeto Date para o primeiro dia do ano
  const firstDayOfYear = new Date(year, 0, 1)

  // Calcula o dia da semana do primeiro dia do ano (0 = domingo, 1 = segunda-feira, etc.)
  const dayOfWeekFirstDayOfYear = firstDayOfYear.getDay()

  // Calcula a data do primeiro domingo do ano
  const startOfFirstWeek = new Date(firstDayOfYear)
  startOfFirstWeek.setDate(firstDayOfYear.getDate() - dayOfWeekFirstDayOfYear)

  // Calcula o início da semana fornecida
  const startOfWeek = new Date(startOfFirstWeek)
  startOfWeek.setDate(startOfFirstWeek.getDate() + (week - 1) * 7)

  // Gera as datas da semana (de domingo a sábado)
  const weekDates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    weekDates.push(date)
  }

  return weekDates
}

/**
 * Função para obter o número da semana no formato "YYYY-Www" considerando que a semana começa no domingo.
 * @param date A data de referência.
 * @returns Uma string representando o número da semana no formato "YYYY-Www".
 */
export function getWeekNumberFromDate(date: Date): string {
  const currentDate = new Date(date.getTime())

  // Define que a data começa com o primeiro dia do ano
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1)

  // Ajusta o primeiro dia do ano para o domingo (semana começa no domingo)
  const dayOfWeek = startOfYear.getDay() // Domingo é 0, segunda é 1, etc.
  startOfYear.setDate(startOfYear.getDate() - dayOfWeek) // Retrocede até o domingo

  // Calcula a diferença de dias entre o início do ano e a data de hoje
  const daysDifference = Math.floor((currentDate.getTime() - startOfYear.getTime()) / 86400000)

  // Calcula o número da semana
  let weekNumber = Math.floor(daysDifference / 7) + 1

  // Formata o número da semana para "YYYY-Www"
  const year = currentDate.getFullYear()
  const week = weekNumber < 10 ? '0' + weekNumber : weekNumber.toString()

  return `${year}-W${week}`
}


export function compareDates(date1: Date, date2: Date): boolean {
  const year1 = date1.getFullYear()
  const month1 = date1.getMonth()
  const day1 = date1.getDate()

  const year2 = date2.getFullYear()
  const month2 = date2.getMonth()
  const day2 = date2.getDate()

  return year1 === year2 && month1 === month2 && day1 === day2
}

export function getPreviousWeek(weekString: string): string {
  const [year, week] = weekString.split('-W').map(Number)

  // Se a semana for a primeira do ano, retorna a última semana do ano anterior
  if (week === 1) {
    const previousYear = year - 1
    return `${previousYear}-W${getWeeksInYear(previousYear)}`
  }

  // Caso contrário, retorna a semana anterior no mesmo ano
  const previousWeek = week - 1
  return `${year}-W${previousWeek < 10 ? '0' + previousWeek : previousWeek}`
}

export function getNextWeek(weekString: string): string {
  const [year, week] = weekString.split('-W').map(Number)
  const weeksInYear = getWeeksInYear(year)

  // Se a semana for a última do ano, retorna a primeira semana do próximo ano
  if (week === weeksInYear) {
    const nextYear = year + 1
    return `${nextYear}-W01`
  }

  // Caso contrário, retorna a próxima semana no mesmo ano
  const nextWeek = week + 1
  return `${year}-W${nextWeek < 10 ? '0' + nextWeek : nextWeek}`
}

function getWeeksInYear(year: number): number {
  // Calcula o número de semanas em um ano
  const januaryFirst = new Date(year, 0, 1)
  const decemberThirtyFirst = new Date(year, 11, 31)
  const daysDifference = (decemberThirtyFirst.getTime() - januaryFirst.getTime()) / (1000 * 60 * 60 * 24)
  return Math.ceil((daysDifference + januaryFirst.getDay() + 1) / 7)
}

/**
 * Função para obter o primeiro e o último dia da semana de uma data fornecida.
 * @param date A data de referência.
 * @returns Um objeto contendo o primeiro e o último dia da semana.
 */
export function getFirstAndLastDayOfWeek(date: Date): {
  firstDay: Date;
  lastDay: Date;
  week: string;
} {
  const inputDate = new Date(date);
  const dayOfWeek = inputDate.getDay(); // Domingo = 0, Segunda = 1, ..., Sábado = 6

  // Considerando que a semana começa no domingo
  const differenceToSunday = dayOfWeek; // Diferença de dias até domingo

  const firstDay = new Date(inputDate);
  firstDay.setDate(inputDate.getDate() - differenceToSunday);
  firstDay.setHours(0, 0, 0, 0); // Zera horas, minutos, segundos e milissegundos

  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);
  lastDay.setHours(23, 59, 59, 999); // Define o final do dia

  return { firstDay, lastDay, week: getWeekNumberFromDate(inputDate) };
}

/**
 * Função para obter o primeiro e o último dia do mês de uma data fornecida.
 * @param date A data de referência.
 * @returns Um objeto contendo o primeiro e o último dia do mês.
 */
export function getFirstAndLastDayOfMonth(date: Date): {
  firstDay: Date;
  lastDay: Date;
  month: string;
} {
  const inputDate = new Date(date);

  const firstDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0); // Início do dia

  const lastDay = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999); // Final do dia

  const month = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}`;

  return { firstDay, lastDay, month };
}


/**
 * Função para obter uma data daqui 5 minutos.
 */
export function getFiveMinutes() {
  return new Date(Date.now() + 5 * 60 * 1000)
}

export function getHelloTextByTime(): string {
  const now = new Date()
  const time = now.getHours()
  
  const validation = {
    morning: time >= 5 && time < 12,
    afternoon: time >= 12 && time < 18,
  }
  
  const strings = {
    morning: 'Bom dia',
    afternoon: 'Bom dia',
    night: 'Boa noite',
  }

  if (validation.morning) return strings.morning
  
  if (validation.afternoon) return strings.afternoon

  return strings.night
}

export function getSevenDaysAgo(): Date {
  const today = new Date()
  today.setHours(0, 0, 0)
  today.setDate(today.getDate() - 7)
  return today
}