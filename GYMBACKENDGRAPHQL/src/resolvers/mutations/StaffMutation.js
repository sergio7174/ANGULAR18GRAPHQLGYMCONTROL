const { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLEnumType,  GraphQLInt } = require('graphql');
const GraphQLSDate = require('../../utils/GraphQLDate');
const Staff = require('../../models/staff');
const StaffType = require('../../type/StaffType');

const staffMutations = {

  addStaff: {
            type: StaffType,
            args: {
                name:      { type: GraphQLNonNull(GraphQLString) },
                email:     { type: GraphQLNonNull(GraphQLString) },
                id_card:   { type: GraphQLNonNull(GraphQLString) },
                image:     { type: GraphQLNonNull(GraphQLString) },
                phone:     { type: GraphQLNonNull(GraphQLString) },
                address:   { type: GraphQLNonNull(GraphQLString) },  
                gender:    { type: GraphQLNonNull(GraphQLString) },
                field:     { type: GraphQLNonNull(GraphQLString) },
                age:       { type: GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args) {
                console.log('Im at addStaff - StaffMutation - line 21 - image: '+args.image);
                const neWStaff = new Staff({ 
                        name:    args.name, 
                        email:   args.email,
                        id_card: args.id_card,
                        image:   args.image,
                        phone:   args.phone,
                        address: args.address,
                        gender:  args.gender,
                        field:   args.field,
                        age:     args.age,
                        createdAt:    new(Date),
                });
                return  neWStaff.save();
            },
        },
        deleteStaff: {
            type: StaffType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                console.log('Im at StaffMutation - deleteStaff - line 41 - args.id: ', args.id);
                StaffRemoved = Staff.findByIdAndDelete(args.id);
                if (!StaffRemoved) {
                    console.log('Staff not found');}
                    console.log('Im at deleteCategory Mutation - line 57 - Category Deleted //Succesfully ' + StaffRemoved);
                
                return StaffRemoved;
            },
        },
        updateTrainer: {
            type: StaffType,
            args: {
                id:        { type: GraphQLNonNull(GraphQLID) },
                name:      { type: GraphQLNonNull(GraphQLString) },
                email:     { type: GraphQLNonNull(GraphQLString) },
                id_card:   { type: GraphQLNonNull(GraphQLString) },
                image:     { type: GraphQLNonNull(GraphQLString) },
                phone:     { type: GraphQLNonNull(GraphQLString) },
                address:   { type: GraphQLNonNull(GraphQLString) },  
                gender:    { type: GraphQLNonNull(GraphQLString) },
                field:     { type: GraphQLNonNull(GraphQLString) },
                age:       { type: GraphQLNonNull(GraphQLInt) },
                
            },
            resolve(parent, args) {
                return Staff.findByIdAndUpdate(
                    args.id,
                    { $set: {
                        name:    args.name, 
                        email:   args.email,
                        id_card: args.id_card,
                        image:   args.image,
                        phone:   args.phone,
                        address: args.address,
                        gender:  args.gender,
                        field:   args.field,
                        age:     args.age,  
                        createdAt:    new(Date), 
                        },
                    },
                    { new: true }
                );
            },
        },
verifyStaff: {   
    type: StaffType,
     args: { email: { type: GraphQLNonNull(GraphQLString) },},
     async resolve(parent, args ) {
     console.log('Im at verifyStaff - StaffMutation - line 88 - email: '+args.email);
     // block to verify if Staff exist
     const email = args.email;
     const emailExists = await Staff.findOne({ email: email });
     console.log("Estoy en  StaffMutation - verifyStaff - line 92 - emailExists:  " + emailExists);
                  if (emailExists) {
                    const data = new Staff({ email:args.email });    
                           return data; 
                        }

                    const StaffFBE = null;
                    console.log("Estoy en  StaffMutation - verifyStaff - line 99 - StaffFBE:  " + StaffFBE);
                    return StaffFBE;
                    
                    }},
    deleteTrainerImage: {
            type: StaffType,
            args: { image: { type: GraphQLNonNull(GraphQLString) }},
            async resolve(parent, args) {
              console.log("Estoy en StaffMutations - line 110 - deleteTrainerImage - image: " +args.image);
                const Image = args.image;
                const filePath = Image;
               fs.unlink(filePath, (err) => {
                 if (err) {
                   if (err.code === 'ENOENT') {
                console.log("Estoy en StaffMutation - line 81 - deleteTrainerImage - File not found: ");
                const message = 'File not found';
                return message;
            }
        }
         const message = 'There were an mistake ....';
         return message
        });
           const message = 'File deleted successfully';
           console.log("Estoy en Staff Mutation - line 125 - deleteStaffImage - File deleted successfully ");
           return message;
       }},
}

module.exports = staffMutations;