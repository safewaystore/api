import { buildTypeDefsAndResolvers } from 'type-graphql';
import { authChecker } from './commom/middlewares/authChecker';
import { UserResolver } from './modules/users/user.resolver';
import { CategoryResolver } from './modules/categories/category.resolver';

export default buildTypeDefsAndResolvers({
  authChecker,
  resolvers: [UserResolver, CategoryResolver],
  emitSchemaFile: true,
  validate: false,
});
