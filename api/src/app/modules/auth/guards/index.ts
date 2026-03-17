import { JwtGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

export const Guards = Object.assign(
  {},
  {
    jwt: JwtGuard,
    roles: RolesGuard,
  },
);
