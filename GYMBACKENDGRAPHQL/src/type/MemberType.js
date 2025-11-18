const { GraphQLObjectType, GraphQLID, GraphQLString,GraphQLInt } = require('graphql');
const GraphQLSDate = require('../utils/GraphQLDate');

// Member Type
const MemberType = new GraphQLObjectType({
    name: 'Member',
    fields: () => ({
        
        id:         { type: GraphQLID },
        namemember: { type: GraphQLString },
        client_CI:  { type: GraphQLString },
        email:      { type: GraphQLString },
        phone:      { type: GraphQLString },
        nameplan:   { type: GraphQLString },
        code:       { type: GraphQLString },
        status:     { type: GraphQLString },
        imageUser:  { type: GraphQLString },
        timedays:   { type: GraphQLInt },
        cost:       { type: GraphQLInt },
        leftdays:   { type: GraphQLString },
        finishAt:   { type: GraphQLSDate}
        
        
    }),
});

module.exports = MemberType;