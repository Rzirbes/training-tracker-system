import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IScheduleRepository } from '../repositories';
import { ValidateConflictDto } from '../dtos/validate-conflict.dto';

@Injectable()
export class ValidateScheduleConflictUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly repository: IScheduleRepository,
  ) {}

  public async validateConflict({
    athleteId,
    coachId,
    start,
    end,
    ignoreId,
  }: ValidateConflictDto) {
    const absenceSchedule = await this.repository.detectAbsence({
      start,
      end,
      coachId,
      notId: ignoreId?.absence,
    });

    if (absenceSchedule) this.absenceException(start);

    const conflict = await this.repository.detectWorkoutConflict({
      start,
      end,
      athleteId,
      coachId,
      notId: ignoreId?.schedule,
    });

    if (conflict.athlete && conflict.coach) {
      this.conflictException(
        conflict,
        'Atleta e o treinador',
        start,
        'possuem',
      );
    }

    if (conflict.athlete) {
      this.conflictException(conflict, 'Atleta', start);
    }

    if (conflict.coach) {
      this.conflictException(conflict, 'Treinador', start);
    }
  }

  private conflictException(
    conflict: { athlete: boolean; coach: boolean },
    key: string,
    start?: Date,
    suffix = 'possui',
  ) {
    const title = 'Conflito de agenda!';
    const date = start.toLocaleDateString('pt-BR', { dateStyle: 'full' });
    const time = start.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const message = `${key} ${suffix} outro agendamento para ${date} às ${time}. Verifique e tente novamente!`;

    throw new ConflictException({
      title,
      message,
      conflict,
    });
  }

  private absenceException(start?: Date) {
    const conflict = { coach: true, athlete: false };
    return this.conflictException(conflict, 'Treinador', start);
  }
}
