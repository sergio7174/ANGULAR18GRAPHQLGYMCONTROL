const 

Member = require('../models/member'),
fs = require('fs'),
path = require('path');

exports.PostDeleteImageCtrl= async(req, res) => {

    const Image = req.body.image;
    const filePath = Image;

    console.log("Estoy en StaffController - line 12 - GetDeleteImageCtrl - image: ");

    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(200).send({ message: 'File not found' });
            }
            return res.status(200).send({ message: 'Error deleting file', error: err });
        }
        res.status(200).json({ message: 'File deleted successfully' ,});
    });
}

// function to get a simple Staff
exports.GetSingleMemberbyemailCtrl= async(req, res) => {

    try {
        
        console.log("Estoy en GetSingleMemberbyemailCtrl - line 30 - req.params.email: "+req.params.email);

        const member = await Member.find({ email: req.params.email });
       
        console.log("EStoy en memberController - line 34 - member:"+member);

        res.status(200).send({ message: 'Single Member Fetched Successfully', 
                               member, 
                               data:member })
    } catch (error) {
        console.log(error); 
        res.status(500).send({ message: `get single Member api issue : ${error}`, error })
    } } // End of Get simgle Staff by email

    /************************** function to create a member  ********/

    // function to create Member
exports.PostCreateMember = async(req, res) => {

    console.log("Estoy en PackController - line 49 - req.file.path:  "+req.file.path);


    const emailExists = await Member.findOne({ email: req.body.email });

    console.log("Estoy en  memberController - line 54 - emailExists:  "+ emailExists);


    if (emailExists) {

        console.log("Estoy en  authController -Dentro de emailExist- line 59 - emailExists:  "+ emailExists);

        return res.status(200).json({ message: 'Email already exits' })
        //return res.status(400).json({ message: 'Email already exits' })
    }

   // Get the current date
const currentDate = new Date();

// Add timedays days to the current date

const futureDate = new Date(currentDate.getTime() + ((req.body.timedays) * 24 * 60 * 60 * 1000)); // Add timedays to get finish Member time

// # days to finish this pack, starting with today
const leftdays = new Date(currentDate.getTime() - ((futureDate)));
const Status = true;

    const GetMemberParams = new Member({
    
        namemember:        req.body.namemember,
        client_CI:         req.body.client_CI,
        email:             req.body.email,
        phone:             req.body.phone,
        nameplan:          req.body.nameplan,
        timedays:          req.body.timedays,
        cost:              req.body.cost,        
        code:              req.body.code,
        status:            Status,
        image:             req.file.path,
        leftdays:          leftdays,
        createdAt:         new(Date),
        finishAt:          futureDate,
    
    
    });

    const member = new Member(GetMemberParams);
    const NewMember = await member.save();
    console.log("Im in MemberController - line 97: Member Created Successfully ..NewMember: "+NewMember);
    return res.status(200).send({NewMember, message: "Member Created Successfully .."})
}
/************************ function to update a member inf */
// function to Edit a Saved Member

exports.PutUpdateMemberCtrl= async(req, res) => {

    console.log("Estoy en PackController - line 105 - PutupdatePackCtrl - req.params.id: "+req.params.id);
    console.log("Estoy en PackController - line 106 - PutupdateMemberkCtrl - req.body.status: " + req.body.status);


        await Member.findByIdAndUpdate(req.params.id, { 
            // if was the only way I could find to save those
            // items with findByIdAndUpdate, not using const PackToUpdate = { req.body }, etc.....

            status:  req.body.status,

             }, { new: true })

            .then(updatedMember => {
          if (updatedMember) {

            console.log('Member updated successfully:', updatedMember);
            
            res.status(200).send({ message: 'Member updated successfully',  updatedMember })
          } else {
            res.status(200).send({ message: 'Member Not updated successfully'})
            console.log('Member not found');
          }
        })
        .catch(error => {
          console.error('Error updating Member:', error);
        })    
    }

    // function to get member list

    // function to list all Members
exports.GetListAllMembers = async(req, res) => {

    console.log("Estoy en memberController - line 138 - GetListAllMembers");
        
            try {
                const Members = await Member.find({}).limit(12).sort({ createdAt: -1 });

               console.log("Estoy en memberController - line 143 - GetListAllMembers name: "+ Members[0].namemember); 

                res.status(200).send({ message: 'All Members fetched successfully', total: Members.length, Members })
            } catch (error) {
                console.log(error);
                res.status(200).send({ message: `get all Members api issue : ${error}`, error })
            }
}

// end of the block of list all Members

