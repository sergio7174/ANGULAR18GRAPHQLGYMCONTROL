const { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLEnumType,  GraphQLInt } = require('graphql');
const GraphQLSDate = require('../../utils/GraphQLDate');
const Class = require('../../models/class');
const ClassType = require('../../type/ClassType');

const classMutations = {

  // this function is not working for the item datebegin
  addClass: {
            type: ClassType,
            args: {
                classname:      { type: GraphQLNonNull(GraphQLString) },
                code:           { type: GraphQLNonNull(GraphQLString) },
                classday:       { type: GraphQLNonNull(GraphQLString) },
                classtime:      { type: GraphQLNonNull(GraphQLString) },
                classlevel:     { type: GraphQLNonNull(GraphQLString) },
                trainer:        { type: GraphQLNonNull(GraphQLString) },
                key_benefits:   { type: GraphQLNonNull(GraphQLString) },
                expert_trainer: { type: GraphQLNonNull(GraphQLString) },
                class_overview: { type: GraphQLNonNull(GraphQLString) },
                why_matters:    { type: GraphQLNonNull(GraphQLString) },
                session_time:   { type: GraphQLNonNull(GraphQLInt) },
                price:          { type: GraphQLNonNull(GraphQLInt) },
                dateBegin:      { type: GraphQLNonNull(GraphQLSDate) },
                image:          { type: GraphQLNonNull(GraphQLString) },  
                                   
            },
            async resolve(parent, args) {
                console.log('Im at addClass Mutation - line 29 - image: ', args.image);
                const code = args.code;
                     const ClassExists = await Class.findOne({ code: code });
                     console.log("Estoy en  classMutation - line 32 - ClassExists:  " + ClassExists);
                                  if (ClassExists) {
                                    console.log("Estoy en  classMutation -Dentro de ClassExist- line 34 - ClassExists - ClassExists:  "+ ClassExists);
                                    const klass = null;
                                    return klass;
                                    }
               // Get the current date
                const currentDate = new Date();

                // Add timedays days to the current date

               const futureDate = new Date(currentDate.getTime() + 
               ((args.session_time) * 24 * 60 * 60 * 1000)); // Add session_time to get finish Class time                     

                const Newclass = new Class({ 
                        classname: args.classname, 
                        code:       args.code,
                        classday:   args.classday, 
                        classtime:  args.classtime,
                        classlevel: args.classlevel,
                        trainer:    args.trainer,
                        session_time:   args.session_time,
                        price:          args.price,
                        key_benefits:   args. key_benefits,
                        expert_trainer: args.expert_trainer,
                        class_overview: args. class_overview,
                        why_matters:    args. why_matters,
                        dateEndClass:   futureDate,
                        dateBegin:      args.dateBegin,
                        image:          args.image,
                        createdAt:      new(Date)
                });
                console.log('Im at addCategory Mutation - line 49 - Newclass: ', Newclass);
                return Newclass.save();
            },
        },
        deleteclass: {
            type: ClassType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Class.findByIdAndRemove(args.id);
            },
        },
        updateClass: {
            type: ClassType,
            args: {
                id:             { type: GraphQLNonNull(GraphQLID) },
                classname:      { type: GraphQLNonNull(GraphQLString) },
                code:           { type: GraphQLNonNull(GraphQLString) },
                classday:       { type: GraphQLNonNull(GraphQLString) },
                classtime:      { type: GraphQLNonNull(GraphQLString) },
                classlevel:     { type: GraphQLNonNull(GraphQLString) },
                session_time:   { type: GraphQLNonNull(GraphQLInt) },
                price:          { type: GraphQLNonNull(GraphQLInt) },
                trainer:        { type: GraphQLNonNull(GraphQLString) },
                dateBegin:      { type: GraphQLNonNull(GraphQLSDate) },
                key_benefits:   { type: GraphQLNonNull(GraphQLString) },
                expert_trainer: { type: GraphQLNonNull(GraphQLString) },
                class_overview: { type: GraphQLNonNull(GraphQLString) },
                why_matters:    { type: GraphQLNonNull(GraphQLString) },
                image:          { type: GraphQLNonNull(GraphQLString) },     
            },
           async resolve(parent, args) {

            console.log('Im at updateClass Mutation - line 101 - id: ', args.id);
             // Get the current date
             const currentDate = new Date();
             // Add timedays days to the current date
             const futureDate = new Date(currentDate.getTime() + 
              ((args.session_time) * 24 * 60 * 60 * 1000)); // Add session_time to get finish Class time 

               try {
                const ClassUpdated = await Class.findByIdAndUpdate(
                    args.id, { $set: {
                        classname: args.classname, 
                        code:      args.code,
                        classday:  args.classday, 
                        classtime: args.classtime,
                        classlevel:     args.classlevel,
                        session_time:   args.session_time,
                        price:          args.price,
                        trainer:        args.trainer,
                        key_benefits:   args. key_benefits,
                        expert_trainer: args.expert_trainer,
                        class_overview: args. class_overview,
                        why_matters:    args. why_matters,
                        dateBegin:      args.dateBegin,
                        dateEndClass:   args.dateEndClass,
                        image:          args.image,
                        createdAt:      new(Date),
                        dateEndClass:   futureDate, 
                        },
                    },
                    { new: true }
                );
                if (!ClassUpdated) {
                 console.log('updateClass: class not found:', args.id);
                 return null;
                    }
                 console.log('Im at updateClass Mutation - line 136 - updateClass: updated class id:', ClassUpdated.id);
                 return ClassUpdated;
                    
            } catch (err) {
                    console.error('updatePack error:', err);
                    throw new Error('Error updating pack');
                }
               
            }
        },
   verifyClass: {   
            type: ClassType,
             args: { code: { type: GraphQLNonNull(GraphQLString) },},
             async resolve(parent, args ) {
             console.log('Im at verifyClass - ClassMutation - line 150 - code: ' + args.code);
             // block to verify if Class exist
             const CodeToSeek = args.code;
             const codeExists = await Class.findOne({ code:CodeToSeek });
            if (codeExists) {
                const data = new Class({ code: args.code });    
                return data;
                }
            console.log("Estoy en  ClassMutation - line 158 - codeExists: NUll  ");
            const ClassFBE = null;
            return ClassFBE }},      
}

module.exports = classMutations;