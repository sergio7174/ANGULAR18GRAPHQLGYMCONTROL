const { GraphQLID, GraphQLList } = require('graphql');
// importing types
const PackageType = require('../../type/PackageType');
// importing models
const Packs = require('../../models/Package');

const packageQueries = {
    packs: {
        type: new GraphQLList(PackageType),
         async resolve(parent, args) { 
          console.log('Im at Packages Queries - line 11: ');
          const packs = await Packs.find();
          console.log('Im at Packs Queries - line 13 - packs: GOT ALL PACKS');  
          return packs;
        },},
     pack: {
        type: PackageType,
        args: { id: { type: GraphQLID } },
        async resolve(parent, args) {
            console.log('Im at Package Queries - line 20 id:', args.id);
            try {
                const pack = await Packs.findById(args.id);
                if (!pack) {
                    console.log('pack not found:', args.id);
                    return null;
                }
                console.log('Im at Package Queries - line 22 pack:', pack);
                return pack;
            } catch (err) {
                console.error('Error in pack query:', err);
                throw new Error('Error fetching pack');
            }
        },
          },
}
module.exports = packageQueries;