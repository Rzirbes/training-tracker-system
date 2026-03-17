import { FindScheduleByUuidResponseDto } from './find-schedule-by-uuid.dto';
import { AbsenceScheduleEntity, ScheduleEntity } from '../entities';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { FindAbsenceScheduleByUuidResponseDto } from './find-absence-schedule-by-uuid.dto';

export class FindSchedulesRequestDto {
  @Type(() => Date)
  @IsDate({ message: 'Data de inicial inválida.' })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'Data de final inválida.' })
  endDate: Date;
}

export class FindSchedulesResponseDto {
  schedules: (
    | FindScheduleByUuidResponseDto
    | FindAbsenceScheduleByUuidResponseDto
  )[];

  constructor(schedules: (AbsenceScheduleEntity | ScheduleEntity)[]) {
    this.schedules = schedules.map((schedule) => {
      if (schedule instanceof AbsenceScheduleEntity) {
        return new FindAbsenceScheduleByUuidResponseDto(schedule);
      }

      return new FindScheduleByUuidResponseDto(schedule);
    });
  }
}
