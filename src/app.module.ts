import { buildTypeDefsAndResolvers } from 'type-graphql';
import { UserResolver } from './modules/users/user.resolver';

export default buildTypeDefsAndResolvers({
  resolvers: [UserResolver],
  emitSchemaFile: true,
  validate: false,
});
