import { BaseEntity, IBaseConstructor } from 'src/app/shared';
import { TrainingEntity } from '../../training';

interface IConstructor extends IBaseConstructor {
  athleteId: number;
  week: string;
  startDate: Date;
  endDate: Date;
  weekLoad?: number;
  averageWeekLoad?: number;
  monotony?: number;
  chronic?: number;
  acute?: number;
  chronicAcute?: number;
  strain?: number;
  deviation?: number;
}

export class MonitoryEntity extends BaseEntity {
  private athleteId: number;
  private week: string;
  private startDate: Date;
  private endDate: Date;
  private weekLoad: number;
  private averageWeekLoad: number;
  private monotony: number;
  private chronic: number;
  private acute: number;
  private chronicAcute: number;
  private strain: number;
  private deviation: number;

  constructor({
    id,
    uuid,
    createdAt,
    updatedAt,
    week,
    startDate,
    endDate,
    athleteId,
    weekLoad = 0,
    acute = 0,
    averageWeekLoad = 0,
    chronic = 0,
    chronicAcute = 0,
    deviation = 0,
    monotony = 0,
    strain = 0,
  }: IConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.week = week;
    this.startDate = startDate;
    this.endDate = endDate;
    this.athleteId = athleteId;
    this.acute = acute;
    this.averageWeekLoad = averageWeekLoad;
    this.chronic = chronic;
    this.chronicAcute = chronicAcute;
    this.deviation = deviation;
    this.monotony = monotony;
    this.strain = strain;
    this.weekLoad = weekLoad;
  }

  public getAthleteId(): number {
    return this.athleteId;
  }

  public getWeek(): string {
    return this.week;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }

  public getWeekLoad(): number {
    return this.weekLoad;
  }

  public getMonotony() {
    return this.monotony;
  }

  public getStrain() {
    return this.strain;
  }

  public getChronicAcute() {
    return this.chronicAcute;
  }

  public getChronic() {
    return this.chronic;
  }

  public getAcute() {
    return this.acute;
  }

  public getAverageWeekLoad() {
    return this.averageWeekLoad;
  }

  public getDeviation() {
    return this.deviation;
  }

  public calculate(
    weekTrainings: TrainingEntity[],
    previousMonitory: MonitoryEntity[],
  ) {
    this.weekLoad = this.calculateWeekLoad(weekTrainings);
    this.averageWeekLoad = this.calculateAverageWeekLoad();
    this.deviation = this.calculateDeviation(
      weekTrainings,
      this.averageWeekLoad,
    );
    this.monotony = this.calculateMonotony();
    this.chronic = this.calculateChronicLoad(previousMonitory);
    this.acute = this.weekLoad;
    this.chronicAcute = this.calculateChronicAcute();
    this.strain = this.calculateStrain();
    return {
      weekLoad: this.weekLoad,
      averageWeekLoad: this.averageWeekLoad,
      deviation: this.deviation,
      monotony: this.monotony,
      chronic: this.chronic,
      acute: this.acute,
      chronicAcute: this.chronicAcute,
      strain: this.strain,
    };
  }

  private calculateWeekLoad(weekTrainings: TrainingEntity[]) {
    return weekTrainings.reduce((acc, training) => acc + training.getLoad(), 0);
  }

  private calculateAverageWeekLoad() {
    const average = this.weekLoad / 7;
    return parseFloat(average.toFixed(1));
  }

  private calculateDeviation(
    weekTrainings: TrainingEntity[],
    averageWeekLoad: number,
  ): number {
    if (!weekTrainings.length) return 1000;

    const mean = averageWeekLoad;

    const squaredDifferences = weekTrainings.map((training) => {
      const load = training.getLoad();
      return Math.pow(load - mean, 2);
    });

    const sumSquaredDifferences = squaredDifferences.reduce(
      (acc, val) => acc + val,
      0,
    );

    if (weekTrainings.length <= 1) return 1000;

    const variance = sumSquaredDifferences / (weekTrainings.length - 1);

    const value = Math.sqrt(variance);

    return !isFinite(value) && value > 0 ? value : 1000;
  }

  private calculateMonotony() {
    const monotony = this.averageWeekLoad / this.deviation;
    return parseFloat(monotony.toFixed(1));
  }

  private calculateChronicLoad(previousMonitory: MonitoryEntity[]) {
    const numberOfWeeks = 4;
    const totalPreviousLoad = previousMonitory.reduce(
      (acc, weekMonitory) => acc + weekMonitory.getWeekLoad(),
      0,
    );
    if (!totalPreviousLoad) return 0;
    return totalPreviousLoad / numberOfWeeks;
  }

  private calculateChronicAcute() {
    if (!this.chronic) return 0;
    const chronicAcute = this.acute / this.chronic;
    return parseFloat(chronicAcute.toFixed(1));
  }

  private calculateStrain() {
    const strain = this.acute * this.monotony;
    return parseFloat(strain.toFixed(1));
  }

  private validateMonotony() {
    const monotony = this.monotony;
    if (!monotony) return;
    if (monotony >= 1.5 && monotony <= 2) {
      // return;
      return {
        warning: false,
        title: 'Monotonia Moderada (1.5 - 2)',
        description:
          'Indica uma boa variação na carga de treinamento, promovendo adaptações enquanto minimiza o risco de lesões.',
      };
    }
    if (monotony < 1.5) {
      return {
        warning: true,
        title: 'Monotonia Baixa (< 1.5)',
        description:
          'Pode ser boa para evitar tédio e lesões, mas se a variação for excessiva, pode não permitir adaptações adequadas.',
      };
    }
    if (monotony > 2) {
      return {
        warning: true,
        title: 'Monotonia Alta (> 2)',
        description:
          'Pode levar ao overtraining e aumentar o risco de lesões devido à pouca variação na carga de treinamento.',
      };
    }
  }

  private validateStrain() {
    const strain = this.strain;
    if (!strain) return;

    if (strain >= 2000 && strain <= 4000) {
      // return;
      return {
        warning: false,
        title: 'Tensão Moderada (2000 - 4000)',
        description:
          'Uma carga de treinamento adequada para promover adaptações sem causar overtraining.',
      };
    }

    if (strain < 2000) {
      return {
        warning: true,
        title: 'Tensão Baixa (< 2000)',
        description:
          'Pode não ser suficiente para provocar adaptações significativas no atleta.',
      };
    }

    if (strain > 4000) {
      return {
        warning: true,
        title: 'Tensão Alta (> 4000)',
        description:
          'Pode indicar um risco elevado de overtraining e lesões devido à alta carga de treinamento.',
      };
    }
  }

  private validateChronicAcute() {
    const chronicAcute = this.chronicAcute;
    if (!chronicAcute) {
      return;
    }

    if (chronicAcute >= 0.8 && chronicAcute <= 1.3) {
      // return;
      return {
        warning: false,
        title: 'Razão Aguda-Crônica Ótima (0.8 - 1.3)',
        description:
          'Indica um equilíbrio adequado entre a carga de treinamento atual e a capacidade de recuperação do atleta.',
      };
    }
    if (chronicAcute < 0.8) {
      return {
        warning: true,
        title: 'Razão Aguda-Crônica Baixa (< 0.8)',
        description:
          'Pode indicar que o atleta não está treinando o suficiente para provocar adaptações.',
      };
    }
    if (chronicAcute > 1.3) {
      return {
        warning: true,
        title: 'Razão Aguda-Crônica Alta (> 1.3)',
        description:
          'Pode indicar um risco elevado de overtraining e lesões devido à alta carga de treinamento recente.',
      };
    }
  }

  public getRiskAssessments() {
    return [
      this.validateChronicAcute(),
      this.validateMonotony(),
      this.validateStrain(),
    ];
  }
}
