const { GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } = require('graphql');

const User = require('../../models/User');
const UserType = require('../../type/UserType');
const AuthPayloadType = require('../../type/AuthType');
const jwt = require('jsonwebtoken'); // For JWT
// multer function to handle images
const upload = require ('../../middleware/upload');

const path = require('path');
const createWriteStream = require('fs');

const authMutations = {

verifyUser: {   
    type: UserType,
     args: { email: { type: GraphQLNonNull(GraphQLString) },},
     async resolve(parent, args ) {
     console.log('Im at verifyUser - AuthMutation - line 19 - email: '+args.email);
     // block to verify if user exist
     const email = args.email;
     const emailExists = await User.findOne({ email: email });
                  //console.log("Estoy en  authMutation - line 29 - emailExists:  " + emailExists);
                  if (emailExists) {
                    const data = new User({
                            fullName: args.fullName,
                            email: args.email,
                            password: args.password,
                            isAdmin: args.isAdmin,
                            image: args.image,
                            });    
                           return data;
                        
                        }
                    
                    const user = null;
                    return user;
                    
                    }},  

addUser: {   
    type: UserType,
     args: {
             fullName: { type: GraphQLNonNull(GraphQLString) },
             email: { type: GraphQLNonNull(GraphQLString) },
             password: { type: GraphQLNonNull(GraphQLString) },
             isAdmin: { type: GraphQLNonNull(GraphQLString) },
             image: { type: GraphQLNonNull(GraphQLString) },
            },
     async resolve(parent, args ) {
     //console.log('Im at addUser - AuthMutation - line 25 - image: '+args.image);
     // block to verify if user exist
     const email = args.email;
     const emailExists = await User.findOne({ email: email });
                  //console.log("Estoy en  authMutation - line 29 - emailExists:  " + emailExists);
                  if (emailExists) {
                    //console.log("Estoy en  authMutation -Dentro de emailExist- line 31 - emailExists - emailExists:  "+ emailExists);
                    const user = null;
                    return user;
                    }
     
     const data = new User({
                            fullName: args.fullName,
                            email: args.email,
                            password: args.password,
                            isAdmin: args.isAdmin,
                            image: args.image,
                            });    
    const user = data.save();
    
    //console.log('Im at addUser - AuthMutation - line 45 - user: ' + user);
    return {user:data}
        },          
            },
    loginUser: {
            type: AuthPayloadType,
                args: {
                    email: { type: GraphQLNonNull(GraphQLString) },
                    password: { type: GraphQLNonNull(GraphQLString) },
                },
                    async resolve(parent, args) {
                    console.log('Im at loginUser - AuthMutation - line 56');
                    const email = args.email;
                    const password = args.password;
                    const user = await User.findOne({ email:email });
                    console.log('Im at loginUser - AuthMutation - line 60 - user: '+ user);
                    console.log('Im at loginUser - AuthMutation - line 61 - user.id: '+ user.id);

                    if (!user || !(user.comparePassword(password))) {
                   
                        throw new Error('Invalid credentials');
                    }
                    
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    console.log('Im at loginUser - AuthMutation - line 69 - token: '+ token);
                    const success = 'true';
                    console.log('Im at login - AuthMutation - line 71 - token: ' + token);
                    return {user, token};
                },
            },
        }

    module.exports = authMutations;
   