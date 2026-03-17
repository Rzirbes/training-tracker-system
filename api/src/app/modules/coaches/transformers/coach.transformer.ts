import { CoachEntity } from '../entities';

export class CoachTransformer {
  static listAll(coaches: CoachEntity[]) {
    return coaches.map((athlete) => ({
      id: athlete.getUuid(),
      name: athlete.getName(),
    }));
  }

  static paginate(coaches: CoachEntity[]) {
    return coaches.map((athlete) => ({
      id: athlete.getUuid(),
      name: athlete.getName(),
      email: athlete.getEmail(),
      isEnabled: athlete.getIsEnabled(),
      role: athlete.getRole(),
      schedulerColor: athlete.getSchedulerColor(),
    }));
  }
}
