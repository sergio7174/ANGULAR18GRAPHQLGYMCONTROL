const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');

const UserType = new GraphQLObjectType({
        name: 'User',
        fields: () => ({
            id: { type: GraphQLID },
            fullName: { type: GraphQLString },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
            isAdmin: { type: GraphQLString },
            image: { type: GraphQLString },

        }),
    });

module.exports = UserType;