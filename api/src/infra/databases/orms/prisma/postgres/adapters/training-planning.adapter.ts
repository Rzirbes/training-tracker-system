import { TrainingPlanningEntity } from 'src/app/modules/training-planning';

export class TrainingPlanningAdapter {
  static create(trainingPlanning: TrainingPlanningEntity) {
    return {
      athleteId: trainingPlanning.getAthleteId(),
      trainingTypeId: trainingPlanning.getTrainingTypeId(),
      date: trainingPlanning.getDate(),
      duration: trainingPlanning.getDuration(),
      pse: trainingPlanning.getPSE(),
      description: trainingPlanning.getDescription(),
      finished: trainingPlanning.getFinished(),
    };
  }
}
