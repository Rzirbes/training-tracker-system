import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CaptureAthleteWellBeingDto } from '../dtos';
import { WellBeingMonitoryEntity } from '../entities';
import type {
  IWellBeingRepository,
  IMonitoryTokenRepository,
} from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CaptureAthleteWellBeingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IWellBeingRepository')
    private readonly wellBeingRepository: IWellBeingRepository,
    @Inject('IMonitoryTokenRepository')
    private readonly tokenRepository: IMonitoryTokenRepository,
  ) {}

  async execute({ token, ...captureData }: CaptureAthleteWellBeingDto) {
    const findToken = await this.tokenRepository.findByToken(token);

    if (!findToken)
      throw new BadRequestException({
        title: 'Token não encontrado.',
        message: 'Verifique e tente novamente...',
      });

    const today = new Date();
    const validateDate = today < findToken.getExpiresIn();

    if (!validateDate)
      throw new BadRequestException({
        title: 'Token expirado.',
        message: 'Verifique e tente novamente...',
      });

    if (!findToken.getIsValid())
      throw new BadRequestException({
        title: 'Token inválido.',
        message: 'Verifique e tente novamente...',
      });

    const capture = new WellBeingMonitoryEntity({
      ...captureData,
      athleteId: findToken.getUserId(),
      date: findToken.getCreatedAt(),
    });

    await this.wellBeingRepository.capture(capture);

    findToken.invalid();
    await this.tokenRepository.update(findToken);

    return {
      title: 'Acompanhamento de bem-estar enviado!',
      message:
        'As informações já foram entregues ao seu treinador e serão muito importantes para o planejamento dos próximos treinos.',
    };
  }
}
