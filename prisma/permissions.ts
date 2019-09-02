import { rule, shield } from 'graphql-shield'
import { getUserId } from './utils'
import { IMiddleware } from 'graphql-middleware';

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    return Boolean(context.user)
  }),
  isPostOwner: rule()(async (parent, { id }, context) => {
    const author = await context.prisma.post({ id }).author()
    return context.user.id === author.id
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
  },
  Mutation: {
    createDraft: rules.isAuthenticatedUser,
    deletePost: rules.isPostOwner,
    publish: rules.isPostOwner,
  },
})

export const getOrCreateUser: IMiddleware = async (resolve, root, args, context, info) => {
  const userUUID = getUserId(context);
  if  (userUUID) {
    const [user] = await context.prisma.users({
      where: {
        uuid: userUUID,
      }
    });

    if (user) {
      context.user = user;
    } else {
      context.user = await context.prisma.createUser({
        uuid: userUUID,
      });
    }
  }
  return resolve(root, args, context, info);
}
