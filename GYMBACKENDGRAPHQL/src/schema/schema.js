const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const RootMutation = require('../resolvers/mutations/RootMutation');
const RootQuery = require('../resolvers/queries/RootQuery');

module.exports = new GraphQLSchema({
  
  query: new GraphQLObjectType({
    name: 'Query',
    fields: RootQuery,
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: RootMutation,
  }),
});
