import { prismaSeed } from '.';
import { UserRoleEnum } from 'src/app/shared';
import * as usersData from './data/users.json';

export async function userSeed() {
  await prismaSeed.user.createMany({
    data: usersData.map(({ name, email, password }) => ({
      name,
      email,
      password,
      role: UserRoleEnum.ADMIN,
    })),
    skipDuplicates: true,
  });
}
