const { GraphQLID, GraphQLList } = require('graphql');
// importing types
const CategoryType = require('../../type/CategoryType');
// importing models
const Category = require('../../models/Category');

const categoryQueries = {
    categories: {
        type: new GraphQLList(CategoryType),
        async resolve(parent, args) { 
          console.log('Im at Categorys Queries - line 11: ');
          const categoryFBE = await Category.find();
          return categoryFBE;  },
          },
     category: {
        type: CategoryType,
        args: { id: { type: GraphQLID } },
        async resolve(parent, args) { 
          console.log('Im at category Queries - line 20 id: ' + id);
          const category = await Category.findById(args.id);
          console.log('Im at categories Queries - line 22 category: ' + category);
          return category;
         },
          },
}
module.exports = categoryQueries;