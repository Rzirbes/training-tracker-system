export class ValidateConflictDto {
  start: Date
  end: Date
  coachId: number
  athleteId?: number
  ignoreId?: {
    absence?: number
    schedule?: number
  }
}