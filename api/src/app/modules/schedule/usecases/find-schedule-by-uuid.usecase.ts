import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';
import { FindScheduleByUuidResponseDto } from '../dtos';
import { IScheduleRepository } from '../repositories';

@Injectable()
export class FindScheduleByUuidUseCase implements IBaseUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}
  public async execute(uuid: string): Promise<FindScheduleByUuidResponseDto> {
    const schedule = await this.scheduleRepository.findByUuid(uuid);
    return new FindScheduleByUuidResponseDto(schedule);
  }
}
