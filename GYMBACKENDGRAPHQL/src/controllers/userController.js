"use strict";

const

  User = require("../models/User"),
  ObjectId = require('mongoose').Types.ObjectId;


// Export object literal with all controller actions.
module.exports = {
// Add an action to handle get requests to the profile view option

GetProfileData: (req, res) => {
  console.log(req.params.userid);

  User.findById({ _id: req.params.userid })
  .then(data => {
     // Send saved data to the next then code block.
     // Store the user data on the response and call the next middleware function.
     console.log("Estoy en userController - GetProfileData - line 255 -data:"+data)
     {res.json(data)}

  })
  // Log error messages and redirect to the home page.
  .catch(error => {
    res.status(403).json("Error in Finding the Doc");

  });},

}