"use strict";

const
  // use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),
  // use system routes
  userRoutes = require("./userRoutes"),
  categoryRoutes = require('./categoryRoutes'),
  memberRoutes = require('./memberRoutes'),
  authRoutes = require("./authRoutes");

  // Adding routes for each page and request type
  router.use("/", userRoutes);
  router.use("/api/auth", authRoutes);
  router.use('/api/category', categoryRoutes);
  router.use('/api/member', memberRoutes);
  
module.exports = router;