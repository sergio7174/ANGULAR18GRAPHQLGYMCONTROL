const 

upload = require ('../middleware/upload'),

  // use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),

  { GetSingleClassCtrl, 
    PostDeleteImageCtrl,
    PostCreateClass,
    PutUpdateClassCtrl, } = require('../controllers/classController');
  

//delete Image route
router.post('/delete-image', PostDeleteImageCtrl);
//get Single Class route
router.get('/get-single-class/:id', GetSingleClassCtrl);
// create class route
router.post('/createClass',upload.single("image"), PostCreateClass);
//updateProduct route
router.put('/update-Class/:id', upload.single("image"), PutUpdateClassCtrl); 


module.exports = router;