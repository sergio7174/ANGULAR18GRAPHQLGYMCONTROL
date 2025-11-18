const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  classname:         {type: String, require: true},
  code:              {type: String, require: true},
  classday:          {type: String, require: true }, // monday, tuesday ....
  classtime:         {type: String, require: true }, // what time of the day it will begin
  classlevel:        {type: String, require: true }, // medium, basic, high ....
  trainer:           {type: String, require: true },
  session_time:      {type: Number, require: true }, // Days number
  price:             {type: Number, require: true },
  key_benefits:      {type: String, require: true },
  expert_trainer:    {type: String, require: true },
  class_overview:    {type: String, require: true },
  why_matters:       {type: String, require: true },
  dateEndClass:      {type: Date, require: true},
  createdAt:         {type: Date, default: Date.now},
  dateBegin:         {type: Date, require: true}, // begin class date
  image:             {type: String, require: true },

});

module.exports = mongoose.model('Class', ClassSchema);
