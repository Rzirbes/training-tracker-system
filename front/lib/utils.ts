import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import { RouteEnum } from '@/enums'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(word: string): string {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function generateRandomNumber(min: number = 0, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateRandomNumbersArray(count: number = 7, min: number = 0, max: number = 1000): number[] {
  const randomNumbers: number[] = []
  for (let i = 0; i < count; i++) {
    randomNumbers.push(generateRandomNumber(min, max))
  }
  return randomNumbers
}

export function buildingRouteWithId(route: RouteEnum, id: string = '', childId = '') {
  return route.replace(':ID', id).replace(':CHILD_ID', childId)
}

export function setDateWithTime(date: Date, time: string) {
  const [hours, minutes, seconds] = time.split(':').map(Number)
  const newDate = new Date(date.getTime())
  newDate.setHours(hours, minutes, seconds)
  return newDate
}

export function calculateTimeDifferenceInMinutes(time1: string, time2: string): number {
  const [h1, m1, s1] = time1.split(':').map(Number)
  const [h2, m2, s2] = time2.split(':').map(Number)

  // Convert to total seconds
  const seconds1 = h1 * 3600 + m1 * 60 + s1
  const seconds2 = h2 * 3600 + m2 * 60 + s2

  // Calculate the absolute difference in seconds
  const differenceInSeconds = Math.abs(seconds2 - seconds1)

  // Convert to minutes
  return Math.floor(differenceInSeconds / 60)
}

export * from './dates'
