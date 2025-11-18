"use strict";

const
 // use the Router module in Express.js
  router = require("express").Router(),
  usersController = require("../controllers/userController");

// Add a route to handle get requests to the profile view option
router.get("/profile/:userid", usersController.GetProfileData );


module.exports = router;