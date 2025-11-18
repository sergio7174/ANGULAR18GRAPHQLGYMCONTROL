const { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLEnumType,  GraphQLInt } = require('graphql');
const GraphQLSDate = require('../../utils/GraphQLDate');
const Member = require('../../models/member');
const MemberType = require('../../type/MemberType');

const memberMutations = {

  addMember: {
            type: MemberType,
            args: {
                namemember:     { type: GraphQLNonNull(GraphQLString) },
                client_CI:      { type: GraphQLNonNull(GraphQLString) },
                email:          { type: GraphQLNonNull(GraphQLString) },
                phone:          { type: GraphQLNonNull(GraphQLString) },
                nameplan:       { type: GraphQLNonNull(GraphQLString) },
                cost:           { type: GraphQLNonNull(GraphQLInt) },
                timedays:       { type: GraphQLNonNull(GraphQLInt) },
                code:           { type: GraphQLNonNull(GraphQLString) },
                status:         { type: GraphQLNonNull(GraphQLString) }, 
                image:          { type: GraphQLNonNull(GraphQLString) },   
            },
            async resolve(parent, args) {
               console.log("Estoy en MemberMutation - line 25 - addmember - image: " +args.image);
                // Get the current date
                const currentDate = new Date();
               // Add timedays days to the current date (use args.timedays, not req)
               const futureDate = new Date(currentDate.getTime() + (args.timedays * 24 * 60 * 60 * 1000)); // Add timedays to get finish Member time

               // Compute remaining days (integer number of days between now and futureDate)
               const leftdays = Math.ceil((futureDate - currentDate) / (24 * 60 * 60 * 1000));

               // Create instance and save with error handling
               try {
                   const memberDoc = new Member({ 
                       namemember:   args.namemember, 
                       client_CI:    args.client_CI,
                       email:        args.email, 
                       phone:        args.phone,
                       nameplan:     args.nameplan,
                       cost:         args.cost,
                       timedays:     args.timedays,
                       leftdays:     leftdays,
                       code:         args.code,
                       status:       args.status,
                       imageUser:    args.image,
                       finishAt:     futureDate,
                   });
                   const saved = await memberDoc.save();
                   console.log("Estoy en MemberMutation - line 51 - saved member: " + saved);
                   return saved;
               } catch (err) {
                   console.error('addMember error:', err);
                   throw new Error('Error creating member');
               }
            },
        },
        deleteMember: {
            type: MemberType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Member.findByIdAndRemove(args.id);
            },
        },
        updateMember: {
            type: MemberType,
            args: {
                id:             { type: GraphQLNonNull(GraphQLID) },
                namemember:     { type: GraphQLNonNull(GraphQLString) },
                client_CI:      { type: GraphQLNonNull(GraphQLString) },
                email:          { type: GraphQLNonNull(GraphQLString) },
                phone:          { type: GraphQLNonNull(GraphQLString) },
                nameplan:       { type: GraphQLNonNull(GraphQLString) },
                cost:           { type: GraphQLNonNull(GraphQLInt) },
                timedays:       { type: GraphQLNonNull(GraphQLInt) },
                leftdays:       { type: GraphQLNonNull(GraphQLInt) },
                code:           { type: GraphQLNonNull(GraphQLString) },
                status:         { type: GraphQLNonNull(GraphQLString) }, 
                imageUser:      { type: GraphQLNonNull(GraphQLString) },
                
            },
            resolve(parent, args) {
                return Member.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                namemember:     { type: GraphQLNonNull(GraphQLString) },
                client_CI:      { type: GraphQLNonNull(GraphQLString) },
                email:          { type: GraphQLNonNull(GraphQLString) },
                phone:          { type: GraphQLNonNull(GraphQLString) },
                nameplan:       { type: GraphQLNonNull(GraphQLString) },
                cost:           { type: GraphQLNonNull(GraphQLInt) },
                timedays:       { type: GraphQLNonNull(GraphQLInt) },
                leftdays:       { type: GraphQLNonNull(GraphQLInt) },
                code:           { type: GraphQLNonNull(GraphQLString) },
                status:         { type: GraphQLNonNull(GraphQLString) }, 
                imageUser:      { type: GraphQLNonNull(GraphQLString) }, 
                        },
                    },
                    { new: true }
                );
            },
        },

verifyMember: {   
    type: MemberType,
     args: { email: { type: GraphQLNonNull(GraphQLString) },},
     async resolve(parent, args ) {
     console.log('Im at verifyMember - memberkMutation - line 111 - email: ' + args.email);
     // block to verify if member exist
     const email = args.email;
     const emailExists = await Member.findOne({ email: email });
     console.log("Estoy en  memberMutation - verifyMember - line 115 - emailExists:  " + emailExists);
        if (emailExists) {
          const data = new Member({ email: args.email });    
            return data;}
          const member = null;
         return member;
    }},   

}

module.exports = memberMutations;