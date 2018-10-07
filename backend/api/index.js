import resolvers from './resolvers';
const { Prisma } = require('prisma-binding');

export default {
  makeConfig: (context) => ({
    typeDefs: './backend/api/schema.graphql',
    resolvers,
    context: (req) => ({
      ...req,
      db: new Prisma({
        typeDefs: process.env.PRISMA_SCHEMA,
        endpoint: context.services['backend.prisma'].outputs.endpoint,
        secret: context.secrets.PRISMA_SECRET
      })
    })
  })
}
