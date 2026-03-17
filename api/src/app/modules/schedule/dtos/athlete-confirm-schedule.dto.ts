import { ScheduleEntity } from '../entities';

export class AthleteConfirmScheduleResponseDto {
  title: string;
  message: string;
  athlete: string;
  date: string;

  constructor(schedule: ScheduleEntity) {
    return {
      title: 'Agendamento confirmado!',
      message: 'O seu treinador será informando sobre o sua confirmação.',
      athlete: schedule.getAthlete().getName(),
      date: schedule.getStart().toLocaleDateString('pt-BR', {
        dateStyle: 'full',
      }),
    };
  }
}
