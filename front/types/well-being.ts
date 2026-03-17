interface DayWellBeingField {
  title: string
  value: number
}

export interface GetDayWellBeingResponseDto {
  id: string
  sleep: DayWellBeingField
  sleepHours: DayWellBeingField
  energy: DayWellBeingField
  pain: DayWellBeingField
  stress: DayWellBeingField
  humor: DayWellBeingField
  nutrition: DayWellBeingField
  waterIntake: DayWellBeingField
  motivation: DayWellBeingField
  fatigue: DayWellBeingField
}
