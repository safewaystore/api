import { AuthChecker } from 'type-graphql';
import { User } from '../../modules/users/user.model';

export const authChecker: AuthChecker<User> = ({ context: { auth } }: any) => {
  if (!auth) {
    return false;
  }
  return false;
};
