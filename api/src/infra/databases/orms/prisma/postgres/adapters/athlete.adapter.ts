import { Athlete, AthleteClub, City, Club, Country, Injury, Pain, State } from '@prisma/client';
import { AthleteClubEntity, AthleteEntity } from 'src/app/modules/athlete';
import { DominantFoot, FootballPosition } from 'src/app/shared';
import { ClubAdapter } from './club.adapter';
import { InjuryAdapter } from './injury.adapter';
import { PainAdapter } from './pain.adapter';
import { AddressAdapter, type AddressWithEntitiesFromDB } from './address.adapter';

interface AthleteDatabase extends Athlete {
  address?: AddressWithEntitiesFromDB;
  injuries?: Injury[];
  pains?: Pain[];
  athleteClubs?: (AthleteClub & {
    club: Club & { country: Country; city: City; state: State };
  })[];
}

export class AthleteAdapter {
  static create({
    injuries = [],
    pains = [],
    athleteClubs = [],
    address,
    ...athlete
  }: AthleteDatabase): AthleteEntity {
    return new AthleteEntity({
      ...athlete,
      avatar: athlete.avatarUrl,
      position: athlete.position as FootballPosition,
      positions: athlete.positions as FootballPosition[],
      dominantFoot: athlete.dominantFoot as DominantFoot,
      injuries: injuries?.map(InjuryAdapter.create),
      pains: pains?.map(PainAdapter.create),
      clubs: athleteClubs?.map(
        ({ club, startDate, endDate, ...rest }) =>
          new AthleteClubEntity({
            ...rest,
            clubId: club.uuid,
            startDate: new Date(startDate),
            club: ClubAdapter.fromDB(club),
            ...(!!endDate && { endDate: new Date(endDate) }),
          }),
      ),
      ...(!!address && { address: AddressAdapter.fromDB(address) }),
    });
  }

  static fromEntity(athlete: AthleteEntity) {
    return {
      name: athlete.getName(),
      email: athlete.getEmail(),
      birthday: athlete.getBirthday(),
      height: athlete.getHeight(),
      weight: athlete.getWeight(),
      isEnabled: athlete.getIsEnabled(),
      cpf: athlete.getCpf() || '',
      phone: athlete.getPhone(),
      position: athlete.getPosition(),
      dominantFoot: athlete.getDominantFoot(),
      bestSkill: athlete.getBestSkill(),
      worstSkill: athlete.getWorstSkill(),
      goal: athlete.getGoal(),
      observation: athlete.getObservation(),
      avatarUrl: athlete.getAvatar(),
      positions: athlete.getPositions(),
      isMonitorDaily: athlete.getIsMonitorDaily(),
    };
  }
}
