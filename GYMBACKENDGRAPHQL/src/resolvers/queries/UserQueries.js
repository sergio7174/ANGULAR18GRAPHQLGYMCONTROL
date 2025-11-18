const { GraphQLID, GraphQLList } = require('graphql');
// importing models
const User = require('../../models/User');
// importing types
const UserType = require('../../type/UserType');

const userQueries = {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) { 
                 console.log('Im at Users Queries - line 24: ');
                return User.find(); },
                 },
        user: {
        type: UserType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) { return User.findById(args.id); },
          },       
        usersAdmin: {
        type: new GraphQLList(UserType),
        async resolve(parent, args) { 
            console.log('Im at UserQueries - line 24 - getUserAdmin: ' );
            const isAdmin = 'true';
            const user = await User.find({ isAdmin: isAdmin });
            
            console.log('Im at UserQueries - line 26 - user: ' + user );
            console.log('Im at UserQueries - line 27 - isAdmin: ' + isAdmin );

            return await User.find({ isAdmin: isAdmin });
        
            
        }
          },   
            
        }

module.exports = userQueries;