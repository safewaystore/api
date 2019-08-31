import { AuthChecker } from 'type-graphql';
import { User } from '../../modules/users/user.model';

export const authChecker: AuthChecker<User> = (
  { context: { auth } }: any,
  roles
) => {
  if (roles.length === 0) {
    return auth !== null;
  }
  if (!auth) {
    return false;
  }

  if (roles.includes(auth.role)) {
    return true;
  }
  return false;
};
