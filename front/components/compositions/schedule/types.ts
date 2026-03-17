export interface IScheduleEvent {
  id: string
  start: Date
  end: Date
  athlete: {
    id: string
    name: string
  }
  trainer: {
    id: string
    name: string
    color: string
  }
  trainingPlanning: {
    pse: number
    duration: number
    description?: string
    trainingType: {
      id: string
      name: string
    }
  }
}
