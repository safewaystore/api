import 'reflect-metadata';
import * as database from '../config/database';
import * as express from 'express';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import buildSchema from './app.module';

const configureExpress = async () => {
  const app: express.Application = express();

  const { typeDefs, resolvers } = await buildSchema;
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    uploads: {
      maxFiles: 10,
      maxFileSize: 1000000,
    },
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
