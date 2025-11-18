const { GraphQLID, GraphQLList } = require('graphql');
// importing models
const Staff = require('../../models/staff');
// importing types
const StaffType = require('../../type/StaffType');

const staffQueries = {

        staffs: {
            type: new GraphQLList(StaffType),
            async resolve(parent, args) { 
                const GetStaff = await Staff.find();
                console.log('Im at staffs queries - line 13: ' + GetStaff);
                return GetStaff 
            },
        },
        staff: {
            type: StaffType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) { return Staff.findById(args.id); },
        },
}

module.exports = staffQueries;