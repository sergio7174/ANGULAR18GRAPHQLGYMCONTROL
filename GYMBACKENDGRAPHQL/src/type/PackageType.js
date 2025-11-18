
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } = require('graphql');
const GraphQLSDate = require('../utils/GraphQLDate');

const PackType = new GraphQLObjectType({      
        name: 'Pack',
        fields: () => ({
            id:          { type: GraphQLID },
            nameplan:    { type: GraphQLString },
            trialdays:   { type: GraphQLInt },
            description: { type: GraphQLString },
            features:    { type: GraphQLString },
            timedays:    { type: GraphQLInt },
            cost:        { type: GraphQLInt },
            code:        { type: GraphQLString },
            status:      { type: GraphQLString },
            image:       { type: GraphQLString },
            
        }),
    });

module.exports = PackType;