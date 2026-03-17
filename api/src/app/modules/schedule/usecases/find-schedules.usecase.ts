import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase, UserRoleEnum } from 'src/app/shared';
import { FindSchedulesRequestDto, FindSchedulesResponseDto } from '../dtos';
import { IScheduleRepository } from '../repositories';
import { UserEntity } from '../../user';

@Injectable()
export class FindSchedulesUseCase implements IBaseUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}
  public async execute(
    input: FindSchedulesRequestDto,
    user: UserEntity,
  ): Promise<FindSchedulesResponseDto> {
    const startDate = new Date(input.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(input.endDate);
    endDate.setHours(23, 59, 59, 59);

    const isAdmin = user.getRole() === UserRoleEnum.ADMIN;

    const absences = await this.scheduleRepository.findAbsences({
      start: startDate,
      end: endDate,
      ...(!isAdmin && {
        userId: user.getId(),
      }),
    });

    const schedules = await this.scheduleRepository.find({
      start: startDate,
      end: endDate,
      ...(!isAdmin && {
        userId: user.getId(),
      }),
    });

    return new FindSchedulesResponseDto([...schedules, ...absences]);
  }
}
