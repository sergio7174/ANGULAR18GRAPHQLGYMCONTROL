const 
upload = require ('../middleware/upload'),
  // use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),

  {
    PostDeleteImageCtrl,
    GetSingleMemberbyemailCtrl,
    PostCreateMember,
    GetListAllMembers,
    PutUpdateMemberCtrl } = require('../controllers/memberController');

 // create member route 
router.post('/', upload.single("image"), PostCreateMember);
//update member route
router.put('/update-member/:id', upload.single("image"), PutUpdateMemberCtrl);
// delete image route
router.post('/delete-image', PostDeleteImageCtrl);
//get Single member route
router.get('/get-single-memberbyemail/:email', GetSingleMemberbyemailCtrl);
// get all members list
router.get('/listAll', GetListAllMembers);


module.exports = router;