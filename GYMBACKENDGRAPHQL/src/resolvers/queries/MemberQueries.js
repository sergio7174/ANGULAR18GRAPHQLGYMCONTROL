const { GraphQLID, GraphQLList, GraphQLString } = require('graphql');
// importing types
const MemberType = require('../../type/MemberType');
// importing models
const Member = require('../../models/member');

const memberQueries = {
    members: {
        type: new GraphQLList(MemberType),
        async resolve(parent, args) { 
          console.log('Im at members Queries - line 11: ');
          const GetMember = Member.find(); 
          console.log('Im at members Queries - line 13 - GetMember: ' + GetMember);
          return GetMember;
          },
          },
    member: {
        type: MemberType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) { 
            console.log('Im at member Queries - line 18 id: ' + id);
            return Member.findById(args.id); },
          },
   memberByEmail:{
       type: MemberType,
       args: { email: { type: GraphQLString }},
         async resolve(parent, args) {
         console.log('Im at member Queries-memberByEmail - line 28 email:', args.email);
         try {
        if (!args.email) return null;
        const member = await Member.findOne({ email: args.email });
        if (!member) {
          console.log('member not found email:', args.email);
          return null;
        }
        const memberfo = await Member.findOne({ email: args.email });
        console.log('Im at member Queries-memberByEmail - line 37 memberfo:', memberfo);
        return memberfo;
      } catch (err) {
        console.error('Error in member query:', err);
        throw new Error('Error fetching member');
      }
    },
    },      
}
module.exports = memberQueries;