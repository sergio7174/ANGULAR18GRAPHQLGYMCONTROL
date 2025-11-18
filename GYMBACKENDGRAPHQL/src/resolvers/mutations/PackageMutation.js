const { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLEnumType,  GraphQLInt } = require('graphql');
const GraphQLSDate = require('../../utils/GraphQLDate');
const Pack = require('../../models/Package');
const PackType = require('../../type/PackageType');
fs = require('fs'),
path = require('path');

const packageMutations = {
  verifyPack: {   
    type: PackType,
     args: { code: { type: GraphQLNonNull(GraphQLString) },},
     async resolve(parent, args ) {
     console.log('Im at verifyPack - packMutation - line 11 - code: '+args.code);
     // block to verify if pack exist
     const code = args.code;
     const codeExists = await Pack.findOne({ code: code });
     console.log("Estoy en  packMutation - line 15 - codeExists:  " + codeExists);
                  if (codeExists) {
                    const data = new Pack({
                           nameplan:     args.nameplan, 
                           description:  args. description,
                           trialdays:    args.trialdays,
                           features:     args.features,
                           image:        args.image,
                           code:         args.code,
                           status:       args.status,
                           timedays:     args.timedays,
                           cost:         args.cost,
                            });    
                           return data;
                        
                        }
                    
                    const pack = null;
                    return pack;
                    
                    }},
   addPack: {
        type: PackType,
        args: {
                nameplan:    { type: GraphQLNonNull(GraphQLString) },
                trialdays:   { type: GraphQLNonNull(GraphQLInt) },
                description: { type: GraphQLNonNull(GraphQLString) },
                features:    { type: GraphQLNonNull(GraphQLString) },
                timedays:    { type: GraphQLNonNull(GraphQLInt) },
                cost:        { type: GraphQLNonNull(GraphQLInt) },
                code:        { type: GraphQLNonNull(GraphQLString) },
                status:      { type: GraphQLNonNull(GraphQLString) },  
                image:       { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                
                console.log('Im at addPack - packageMutation - line 51 - image: '+args.image);

                const newPack = new Pack({ 
                    
                           nameplan:     args.nameplan,
                           trialdays:    args.trialdays, 
                           description:  args. description,
                           features:     args.features,
                           timedays:     args.timedays,
                           cost:         args.cost,
                           code:         args.code,
                           status:       args.status,
                           image:        args.image,
                           createdAt:    new(Date),
                });
                
                return newPack.save();
            },
        },
        deletePack: {
            type: PackType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                console.log("Estoy en package mutation - deletePack - line 76 - id:", args.id);
                try {
                    // use findByIdAndDelete (recommended) instead of deprecated findByIdAndRemove
                    const deleted = await Pack.findByIdAndDelete(args.id);
                    if (!deleted) {
                        console.log('deletePack: pack not found:', args.id);
                        return null; // GraphQL will receive null when nothing was deleted
                    }
                    return deleted;
                } catch (err) {
                    console.error('deletePack error:', err);
                    throw new Error('Error deleting pack');
                }
            },
        },
        deletePackImage: {
            type: PackType,
            args: { image: { type: GraphQLNonNull(GraphQLString) }},
            async resolve(parent, args) {
              console.log("Estoy en Packagemutation - line 95 - deletePackImage - image: " +args.image);
                const Image = args.image;
                const filePath = Image;
               fs.unlink(filePath, (err) => {
                 if (err) {
                   if (err.code === 'ENOENT') {
                console.log("Estoy en Packagemutation - line 103 - deletePackImage - File not found: ");
                const message = 'File not found';
                return message;
            }
        }
         const message = 'There were an mistake ....';
         return message
        });
           const message = 'File deleted successfully';
           console.log("Estoy en Packagemutation - line 112 - deletePackImage - File deleted successfully ");
           return message;
       }
    },
         updatePack: {
            type: PackType,
            args: {
                id:          { type: GraphQLNonNull(GraphQLID) },
                nameplan:    { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                features:    { type: GraphQLNonNull(GraphQLString) },
                trialdays:   { type: GraphQLNonNull(GraphQLInt) },
                timedays:    { type: GraphQLNonNull(GraphQLInt) },
                cost:        { type: GraphQLNonNull(GraphQLInt) },
                code:        { type: GraphQLNonNull(GraphQLString) },
                status:      { type: GraphQLNonNull(GraphQLString) },  
                image:       { type: GraphQLNonNull(GraphQLString) },
               
                
            },
            async resolve(parent, args) {
                console.log("Estoy en Pack Mutation -   LINE 133 - updatePack - id:", args.id);
                console.log("Estoy en Pack Mutation - line 134 - updatePack - image:", args.image);
                try {
                    const PackUpdated = await Pack.findByIdAndUpdate(
                        args.id,
                        {
                            $set: {
                                nameplan: args.nameplan,
                                description: args.description,
                                features: args.features,
                                trialdays: args.trialdays,
                                timedays: args.timedays,
                                cost: args.cost,
                                code: args.code,
                                status: args.status,
                                image: args.image,
                            },
                        },
                        { new: true }
                    );
                    if (!PackUpdated) {
                        console.log('update Pack - line 154 - PackageMutation - updatePack: pack not found:', args.id);
                        return null;
                    }
                    console.log('update Pack - line 157 - PackageMutation - updatePack: updated pack id:', PackUpdated._id);
                    return PackUpdated;
                } catch (err) {
                    console.error('updatePack error:', err);
                    throw new Error('Error updating pack');
                }
            },
        },
}

module.exports = packageMutations;