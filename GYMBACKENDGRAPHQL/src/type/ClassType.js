const Class = require('../models/class');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt  } = require('graphql');
const GraphQLSDate = require('../utils/GraphQLDate');

// Client Type
const ClassType = new GraphQLObjectType({
    name: 'Class',
    fields: () => ({
  id:              { type: GraphQLID },
  classname:       { type: GraphQLString },
  code:            { type: GraphQLString },
  classday:        { type: GraphQLString }, // monday, tuesday ....
  classtime:       { type: GraphQLString }, // what time of the day it will begin
  classlevel:      { type: GraphQLString }, // medium, basic, high ....
  session_time:    { type: GraphQLInt }, // Days number
  price:           { type: GraphQLInt },
  trainer:         { type: GraphQLString },
  dateBegin:       { type: GraphQLSDate}, // begin class date
  key_benefits:    { type: GraphQLString },
  expert_trainer:  { type: GraphQLString },
  class_overview:  { type: GraphQLString },
  why_matters:     { type: GraphQLString },
  image:           { type: GraphQLString },
    }),
});

module.exports = ClassType;