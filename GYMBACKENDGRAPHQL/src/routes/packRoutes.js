const 
upload = require ('../middleware/upload'),

  // use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),

  { PostCreatePack,
    PutUpdatePackCtrl,
    GetSinglePackCtrl,
    GetSinglePackByCodeCtrl } = require('../controllers/packController');

// create a pack route    
router.post('/',upload.single("image"), PostCreatePack);

// update Pack route
router.put('/update-pack/:id', upload.single("image"), PutUpdatePackCtrl); 

//get Single Pack route
router.get('/get-single-pack/:id', GetSinglePackCtrl);

// Get Single Pack By Code Ctrl route
router.get('/get-single-packbycode/:code', GetSinglePackByCodeCtrl);


module.exports = router;