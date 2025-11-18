
const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');
const GraphQLSDate = require('../utils/GraphQLDate');




const CategoryType = new GraphQLObjectType({
        
        name: 'Category',
        fields: () => ({

            id: { type: GraphQLID },
            name: { type: GraphQLString },
            description: { type: GraphQLString },
            image: { type: GraphQLString },
            
            

        }),
    });

module.exports = CategoryType;

