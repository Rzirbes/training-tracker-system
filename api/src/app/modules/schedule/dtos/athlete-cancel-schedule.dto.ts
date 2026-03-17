import { ScheduleEntity } from '../entities';

export class AthleteCancelScheduleResponseDto {
  title: string;
  message: string;
  athlete: string;
  date: string;

  constructor(schedule: ScheduleEntity) {
    return {
      title: 'Agendamento cancelado!',
      message: 'O seu treinador será informando sobre o cancelamento.',
      athlete: schedule.getAthlete().getName(),
      date: schedule.getStart().toLocaleDateString('pt-BR', {
        dateStyle: 'full',
      }),
    };
  }
}
