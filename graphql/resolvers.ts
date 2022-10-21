import { DateTimeResolver } from 'graphql-scalars';

export const resolvers = {
  Query: {
    users: async (_parent, _args, ctx) => await ctx.prisma.user.findMany(),
  },
  DateTime: DateTimeResolver,
};
