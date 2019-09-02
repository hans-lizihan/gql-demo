import { prisma } from './generated/prisma-client'
import datamodelInfo from './generated/nexus-prisma'
import * as path from 'path'
import { stringArg, idArg } from 'nexus'
import { prismaObjectType, makePrismaSchema } from 'nexus-prisma'
import { GraphQLServer } from 'graphql-yoga'
import { getOrCreateUser, permissions } from './permissions';

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      resolve: (parent, args, ctx) => ctx.prisma.user({ id: ctx.user.id }),
    })
    t.list.field('feed', {
      type: 'Post',
      resolve: (_, _args, ctx) =>
        ctx.prisma.posts({ where: { published: true } }),
    })
    t.list.field('postsByUser', {
      type: 'Post',
      args: { uuid: stringArg() },
      resolve: (_, { uuid }, ctx) =>
        ctx.prisma.posts({ where: { author: { uuid } } }),
    })
  },
});

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['createUser', 'deletePost'])
    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg(),
      },
      resolve: (_, { title }, ctx) =>
        ctx.prisma.createPost({
          title,
          author: { connect: { id: ctx.user.id } },
        }),
    })
    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: { id: idArg() },
      resolve: (_, { id }, ctx) =>
        ctx.prisma.updatePost({
          where: { id },
          data: { published: true },
        }),
    })
  },
})

const schema = makePrismaSchema({
  types: [Query, Mutation],

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },
})


const server = new GraphQLServer({
  schema,
  middlewares: [getOrCreateUser, permissions],
  context: (request: any)  => ({ ...request,  prisma }),
})

server.start(() => console.log('Server is running on http://localhost:4000'));
