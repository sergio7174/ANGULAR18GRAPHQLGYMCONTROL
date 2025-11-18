const { GraphQLID, GraphQLList } = require('graphql');
// importing types
const ClassType = require('../../type/ClassType');
// importing models
const Class = require('../../models/class');

const classQueries = {
    classes: {
         type: new GraphQLList(ClassType),
         async resolve(parent, args) { 
          console.log('Im at Classes Queries - line 11: ');
          const classesFBE = await Class.find();
          console.log('Im at Classes Queries - line 13 - classes: GOT ALL CLASSES');
          return classesFBE;
         },
          },
    classe: {
        type: ClassType,
        args: { id: { type: GraphQLID } },
        async resolve(parent, args) {
        console.log('Im at Package Queries - line 21 id:', args.id);
        try {
             const classe = await Class.findById(args.id);
             if (!classe) {
              console.log('Class not found:', args.id);
              return null;
                          }
            console.log('Im at Classes Queries - line 28 Classe:', classe);
                        return classe;
            } catch (err) {
            console.error('Error in classe query:', err);
                throw new Error('Error fetching Classe');
                    }
                },
                  },
}
module.exports = classQueries;