const 

upload = require ('../middleware/upload'),

  // use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),

  { 
    GetSingleCategoryCtrl,
    PostdeleteImageCtrl } = require('../controllers/categoryController');

//delete Image route
router.post('/delete-image', PostdeleteImageCtrl);

//getSingleProduct route
router.get('/get-single-category/:id', GetSingleCategoryCtrl);


module.exports = router;