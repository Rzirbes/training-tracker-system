import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { WellBeingMonitoryEntity } from '../entities';

export class GetDayWellBeingRequestDto {
  @IsString()
  @IsUUID('4')
  athleteId: string;

  @Type(() => Date)
  @IsDate()
  date: Date;
}

class WellBeingField {
  title: string;
  value: number;
}

export class GetDayWellBeingResponseDto {
  id: string;
  sleep: WellBeingField;
  sleepHours: WellBeingField;
  energy: WellBeingField;
  pain: WellBeingField;
  stress: WellBeingField;
  humor: WellBeingField;
  nutrition: WellBeingField;
  waterIntake: WellBeingField;
  motivation: WellBeingField;
  fatigue: WellBeingField;

  constructor(entity: WellBeingMonitoryEntity) {
    this.id = entity.getUuid();
    const labels = entity.getLabels();
    this.sleep = {
      title: labels.sleep,
      value: entity.getSleep(),
    };
    this.sleepHours = {
      title: labels.sleepHours,
      value: entity.getSleepHours(),
    };
    this.energy = {
      title: labels.energy,
      value: entity.getEnergy(),
    };
    this.pain = {
      title: labels.pain,
      value: entity.getPain(),
    };
    this.stress = {
      title: labels.stress,
      value: entity.getStress(),
    };
    this.humor = {
      title: labels.humor,
      value: entity.getHumor(),
    };
    this.nutrition = {
      title: labels.nutrition,
      value: entity.getNutrition(),
    };
    this.waterIntake = {
      title: labels.waterIntake,
      value: entity.getWaterIntake(),
    };
    this.motivation = {
      title: labels.motivation,
      value: entity.getMotivation(),
    };
    this.fatigue = {
      title: labels.fatigue,
      value: entity.getFatigue(),
    };
  }
}
