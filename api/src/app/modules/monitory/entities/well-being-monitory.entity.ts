import { BaseEntity, type IBaseConstructor } from 'src/app/shared';

interface WellBeingProps {
  sleep: number;
  energy: number;
  pain: number;
  stress: number;
  humor: number;
  nutrition: number;
  waterIntake: number;
  fatigue: number;
  sleepHours: number;
  motivation: number;
}

interface WellBeingConstructor extends IBaseConstructor, WellBeingProps {
  athleteId: number;
  date: Date;
}

export class WellBeingMonitoryEntity extends BaseEntity {
  private athleteId: number;
  private date: Date;
  private sleep: number;
  private sleepHours: number;
  private energy: number;
  private pain: number;
  private stress: number;
  private humor: number;
  private nutrition: number;
  private waterIntake: number;
  private fatigue: number;
  private motivation: number;

  constructor({
    athleteId,
    date,
    sleep,
    energy,
    pain,
    stress,
    humor,
    motivation,
    fatigue,
    nutrition,
    sleepHours,
    waterIntake,
    id,
    uuid,
    createdAt,
    updatedAt,
  }: WellBeingConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.athleteId = athleteId;
    this.date = date;
    this.sleep = sleep;
    this.energy = energy;
    this.pain = pain;
    this.stress = stress;
    this.humor = humor;
    this.motivation = motivation;
    this.fatigue = fatigue;
    this.nutrition = nutrition;
    this.sleepHours = sleepHours;
    this.waterIntake = waterIntake;
  }

  public getAthleteId(): number {
    return this.athleteId;
  }

  public getDate(): Date {
    return this.date;
  }

  public getSleep(): number {
    return this.sleep;
  }

  public getSleepHours(): number {
    return this.sleepHours;
  }

  public getEnergy(): number {
    return this.energy;
  }

  public getPain(): number {
    return this.pain;
  }

  public getStress(): number {
    return this.stress;
  }

  public getHumor(): number {
    return this.humor;
  }

  public getNutrition(): number {
    return this.nutrition;
  }

  public getWaterIntake(): number {
    return this.waterIntake;
  }

  public getFatigue(): number {
    return this.fatigue;
  }

  public getMotivation(): number {
    return this.motivation;
  }

  public getLabels() {
    return {
      nutrition: 'Alimentação',
      waterIntake: 'Água ingerida',
      energy: 'Energia',
      fatigue: 'Fadiga',
      sleep: 'Noite de Sono',
      sleepHours: 'Horas de Sono',
      pain: 'Dor',
      humor: 'Humor',
      stress: 'Stress',
      motivation: 'Motivação',
    };
  }

  public update({
    sleep,
    energy,
    pain,
    stress,
    humor,
    motivation,
    fatigue,
    nutrition,
    sleepHours,
    waterIntake,
  }: WellBeingProps) {
    this.sleep = sleep;
    this.energy = energy;
    this.pain = pain;
    this.stress = stress;
    this.humor = humor;
    this.motivation = motivation;
    this.fatigue = fatigue;
    this.nutrition = nutrition;
    this.sleepHours = sleepHours;
    this.waterIntake = waterIntake;
  }
}
