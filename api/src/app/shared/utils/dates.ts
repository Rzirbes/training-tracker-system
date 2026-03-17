export function getWeekDatesFromInput(weekString: string): Date[] {
  const [year, week] = weekString.split('-W').map(Number);

  // Cria um objeto Date para o primeiro dia do ano
  const firstDayOfYear = new Date(year, 0, 1);

  // Calcula o dia da semana do primeiro dia do ano (0 = domingo, 1 = segunda-feira, etc.)
  const dayOfWeekFirstDayOfYear = firstDayOfYear.getDay();

  // Calcula a data do primeiro domingo do ano
  const startOfFirstWeek = new Date(firstDayOfYear);
  startOfFirstWeek.setDate(firstDayOfYear.getDate() - dayOfWeekFirstDayOfYear);

  // Calcula o início da semana fornecida
  const startOfWeek = new Date(startOfFirstWeek);
  startOfWeek.setDate(startOfFirstWeek.getDate() + (week - 1) * 7);

  // Gera as datas da semana (de domingo a sábado)
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
}

/**
 * Função para obter o número da semana no formato "YYYY-Www" considerando que a semana começa no domingo.
 * @param date A data de referência.
 * @returns Uma string representando o número da semana no formato "YYYY-Www".
 */
/**
 * Função para obter o número da semana no formato "YYYY-Www" considerando que a semana começa no domingo.
 * @param date A data de referência.
 * @returns Uma string representando o número da semana no formato "YYYY-Www".
 */
export function getWeekNumberFromDate(date: Date): string {
  const currentDate = new Date(date.getTime());

  // Define que a semana começa no domingo
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Retrocede para o domingo

  // Calcula o início do ano
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

  // Calcula o número da semana
  const daysDifference = Math.ceil(
    (currentDate.getTime() - startOfYear.getTime()) / 86400000,
  );
  let weekNumber = Math.floor((daysDifference + 1) / 7) + 1; // Adiciona 1 para ajustar para o início no domingo

  // Ajuste para o caso em que o último dia do ano é na semana 1 do ano seguinte
  if (weekNumber === 0) {
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
    endOfYear.setHours(0, 0, 0, 0);
    endOfYear.setDate(endOfYear.getDate() - endOfYear.getDay()); // Retrocede para o domingo
    weekNumber = getISOWeekNumber(endOfYear); // Recalcula a semana para o último domingo do ano
  }

  // Formata o número da semana para o formato "YYYY-Www"
  const year = currentDate.getFullYear();
  const week = weekNumber < 10 ? '0' + weekNumber : weekNumber.toString();

  return `${year}-W${week}`;
}

export function getLastFourWeeksFromDate(date: Date): string[] {
  const weeks: string[] = [];
  const currentDate = new Date(date);

  // Itera para obter as últimas 4 semanas
  for (let i = 0; i < 4; i++) {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 7 * (i + 1)); // Retrocede 7 dias para cada semana anterior
    weeks.push(getWeekNumberFromDate(previousDate));
  }

  return weeks;
}

export function compareDates(date1: Date, date2: Date): boolean {
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const day1 = date1.getDate();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();

  return year1 === year2 && month1 === month2 && day1 === day2;
}

export function compareDateTimes(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate() &&
    date1.getHours() === date2.getHours() &&
    date1.getMinutes() === date2.getMinutes() &&
    date1.getSeconds() === date2.getSeconds() &&
    date1.getMilliseconds() === date2.getMilliseconds()
  );
}

export function getNextWeek(weekString: string): string {
  const [year, week] = weekString.split('-W').map(Number);
  const weeksInYear = getWeeksInYear(year);

  // Se a semana for a última do ano, retorna a primeira semana do próximo ano
  if (week === weeksInYear) {
    const nextYear = year + 1;
    return `${nextYear}-W01`;
  }

  // Caso contrário, retorna a próxima semana no mesmo ano
  const nextWeek = week + 1;
  return `${year}-W${nextWeek < 10 ? '0' + nextWeek : nextWeek}`;
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
  firstDay.setHours(3, 0, 0, 0); // Zera horas, minutos, segundos e milissegundos no BR

  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 7);
  lastDay.setHours(2, 59, 59, 999); // Define o final do dia no BR

  return { firstDay, lastDay, week: getWeekNumberFromDate(inputDate) };
}

/**
 * Função para obter um array com as 4 últimas semanas com base em uma semana fornecida.
 * @param weekString A string representando a semana no formato "YYYY-Www".
 * @returns Um array de strings representando as 4 últimas semanas no formato "YYYY-Www".
 */
export function getLastFourWeeks(weekString: string): string[] {
  const weeksArray: string[] = [];

  // Adiciona a semana atual
  weeksArray.push(weekString);

  // Adiciona as semanas anteriores até completar 4 semanas
  for (let i = 1; i < 5; i++) {
    const previousWeek = getPreviousWeek(weeksArray[i - 1]);
    weeksArray.push(previousWeek);
  }

  return weeksArray.reverse().slice(0, weeksArray.length - 1);
}

/**
 * Função para obter a semana anterior com base em uma string no formato "YYYY-Www".
 * Considera que a semana começa no domingo.
 * @param weekString A string representando a semana no formato "YYYY-Www".
 * @returns Uma string representando a semana anterior no formato "YYYY-Www".
 */
export function getPreviousWeek(weekString: string): string {
  const [year, week] = weekString.split('-W').map(Number);

  if (week === 1) {
    const previousYear = year - 1;
    return `${previousYear}-W${getWeeksInYear(previousYear)}`;
  }

  const previousWeek = week - 1;
  return `${year}-W${previousWeek < 10 ? '0' + previousWeek : previousWeek}`;
}

/**
 * Função para obter o número de semanas em um ano específico.
 * @param year O ano para o qual se deseja calcular o número de semanas.
 * @returns O número total de semanas no ano.
 */
function getWeeksInYear(year: number): number {
  const lastDayOfYear = new Date(year, 11, 31);
  return getISOWeekNumber(lastDayOfYear);
}

/**
 * Função para obter o número da semana ISO-8601 considerando que a semana começa no domingo.
 * @param date A data de referência.
 * @returns O número da semana ISO-8601.
 */
function getISOWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  startOfYear.setDate(startOfYear.getDate() - startOfYear.getDay());
  const daysDifference = Math.floor(
    (date.getTime() - startOfYear.getTime()) / 86400000,
  );
  return Math.floor(daysDifference / 7) + 1;
}

/**
 * Função para obter a data 28 dias anteriores a uma data fornecida.
 * @param date A data de referência.
 * @returns A data 28 dias anteriores.
 */
export function getDate28DaysEarlier(date: Date): Date {
  // Cria um novo objeto Date baseado na data fornecida para evitar mutação
  const dateCopy = new Date(date);
  // Subtrai 28 dias da data
  dateCopy.setDate(dateCopy.getDate() - 28);
  // Retorna a data 28 dias anteriores
  return dateCopy;
}
