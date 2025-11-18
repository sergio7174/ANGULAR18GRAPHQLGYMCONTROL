const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');
const UserType = require('./UserType');

const AuthPayloadType = new GraphQLObjectType({
      name: 'AuthPayload',
      fields: {
        token: {
          type: GraphQLString
        },
        user: {
          type: UserType
        },
      },
    });

module.exports = AuthPayloadType;