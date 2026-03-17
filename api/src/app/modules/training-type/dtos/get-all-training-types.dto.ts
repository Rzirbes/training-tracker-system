class TrainingType {
  label: string;
  value: string;
  isDefault: boolean;
}

export class GetAllTrainingTypesDto {
  trainingTypes: TrainingType[];
}
