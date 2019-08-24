import * as bcrypt from 'bcrypt';
import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { userModel, User } from './user.model';
import { UserNotFound, UserIncorrect } from '../../commom/errors';
import { JWT } from '../../commom/jwt';
import { LoginUserInput } from './inputs/loginUser.input';
import { CreateUserInput } from './inputs/createUser.input';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  public async users() {
    return userModel.find({});
  }

  @Mutation(() => User)
  public async createUser(
    @Arg('input', () => CreateUserInput) input: CreateUserInput
  ) {
    const user = await userModel.create(input);

    user.token = JWT.createToken(user.toObject());
    return user;
  }

  @Mutation(() => User)
  public async login(
    @Arg('input', () => LoginUserInput) input: LoginUserInput
  ) {
    return userModel.findOne({ email: input.email }).then(async user => {
      if (!user) throw new UserNotFound();

      return bcrypt.compare(input.password, user.password).then(res => {
        if (res) {
          user.token = JWT.createToken(user.toObject());

          return user;
        }
        throw new UserIncorrect();
      });
    });
  }
}
