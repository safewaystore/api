import { buildTypeDefsAndResolvers } from 'type-graphql';
import { authChecker } from './commom/middlewares/authChecker';
import { UserResolver } from './modules/users/user.resolver';
import { CategoryResolver } from './modules/categories/category.resolver';
import { ProductResolver } from './modules/products/product.resolver';

export default buildTypeDefsAndResolvers({
  authChecker,
  resolvers: [UserResolver, CategoryResolver, ProductResolver],
  emitSchemaFile: true,
  validate: false,
});
