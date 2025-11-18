const 

upload = require ('../middleware/upload'),

  // use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),

  { GetSingleStaffCtrl } = require('../controllers/staffController');


//get Single Staff route
router.get('/get-single-staff/:id', GetSingleStaffCtrl);


module.exports = router;