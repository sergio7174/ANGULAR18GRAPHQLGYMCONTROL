const { GraphQLID, GraphQLString, GraphQLNonNull } = require('graphql');
const GraphQLSDate = require('../../utils/GraphQLDate');
// import models
const Category = require('../../models/Category');
// import types
const CategoryType = require('../../type/CategoryType');


const categoryMutations = {
        verifyCategory: {   
            type: CategoryType,
             args: { name: { type: GraphQLNonNull(GraphQLString) },},
             async resolve(parent, args ) {
             console.log('Im at verifyCategory - CategoryMutation - line 13 - name: ' + args.name);
             // block to verify if Category exist
             const NameToSeek = args.name;
             const nameExists = await Category.findOne({ name:NameToSeek });
            
                          if (nameExists) {
                            const data = new Category({ name: args.name });    
                                   return data; 
                                }
                            console.log("Estoy en  CategoryMutation - line 23 - nameExists: NUll  ");
                            const CategoryFBE = null;
                            return CategoryFBE;
                            
                            }},
        addCategory: {
            type: CategoryType,
            args: {
                name:        { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                image:       { type: GraphQLNonNull(GraphQLString) },
                
            },
            resolve(parent, args) {
                console.log('Im at addCategory Mutation - line 37 - image: ', args.image)
                const Newcategory = new Category({
                    name:        args.name,
                    description: args.description,
                    image:       args.image,
                    createdAt:   new(Date)      
                });
                console.log('Im at addCategory Mutation - line 44 - Newcategory: ', Newcategory);
                return Newcategory.save();
            },
        },
        // delete Category Mutation
        deleteCategory: {
            type: CategoryType,
            args: { id: { type: GraphQLNonNull(GraphQLID) },},
            resolve(parent, args) {
                console.log('Im at deleteCategory Mutation - line 53 - args.id: ', args.id);
                CategoryRemoved = Category.findByIdAndDelete(args.id);
                if (!CategoryRemoved) {
                    console.log('Category not found');}
                console.log('Im at deleteCategory Mutation - line 57 - Category Deleted //Succesfully ' + CategoryRemoved);
                return Category.findByIdAndRemove(args.id);
            },
        }, // end of delete Category Mutation
        // update Category mutation
        updateCategory: {
                    type: CategoryType,
                    args: {
                        id:          { type: GraphQLNonNull(GraphQLID) },
                        name:        { type: GraphQLNonNull(GraphQLString) },
                        description: { type: GraphQLNonNull(GraphQLString) },
                        image:       { type: GraphQLNonNull(GraphQLString) },
                        
                    },
                    async resolve(parent, args) {
                        console.log('Im at updateCategory Mutation - line 72 - args.id: ', args.id);
                        categoryUpdated = await Category.findByIdAndUpdate(
                            args.id,
                            {
                                $set: {
                                    name:        args.name,
                                    description: args.description,
                                    image:       args.image,
                                    createdAt:   new(Date)
                                },
                            },
                            { new: true }
                        );
                        console.log('Im at updateCategory Mutation - line 85 - categoryUpdated: ', categoryUpdated);
                        return categoryUpdated;
                    },
                },// end of update category mutation
}

module.exports = categoryMutations;