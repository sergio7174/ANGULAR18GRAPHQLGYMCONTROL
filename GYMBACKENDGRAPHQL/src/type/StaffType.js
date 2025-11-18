// src/type/Stafftype.js
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID  } = require('graphql');
const GraphQLSDate = require('../utils/GraphQLDate');

const StaffType = new GraphQLObjectType({
        
        name: 'Staff',
        fields: () => ({
            id:        { type: GraphQLID },
            name:      { type: GraphQLString },
            email:     { type: GraphQLString },
            image:     { type: GraphQLString },
            id_card:   { type: GraphQLString },
            phone:     { type: GraphQLString },
            address:   { type: GraphQLString },
            gender:    { type: GraphQLString },
            field:     { type: GraphQLString },
            age:       { type: GraphQLInt  },
            createdAt: { type: GraphQLSDate },
        }),
    });

module.exports = StaffType;