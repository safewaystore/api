import 'reflect-metadata';

import * as database from '../config/database';
import * as express from 'express';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import buildSchema from './app.module';
import { Auth } from './commom/auth';

const configureExpress = async () => {
  const app: express.Application = express();

  app.use(express.static('./', { dotfiles: 'allow' }));

  const { typeDefs, resolvers } = await buildSchema;
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    uploads: {
      maxFiles: 10,
      maxFileSize: 1000000,
    },
    context: async ({ req }) => ({
      auth: await Auth.getUser(req),
    }),
    formatError: err => ({
      message: err.message,
      code: err.extensions && err.extensions.code,
      locations: err.locations,
      path: err.path,
      extensions: err.extensions && err.extensions.exception,
    }),
  });

  server.applyMiddleware({ app });

  return app;
};

export default () => database.connect().then(configureExpress);
