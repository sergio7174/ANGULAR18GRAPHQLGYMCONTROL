const mongoose = require('mongoose');

const PackSchema = new mongoose.Schema({
   // Add schema properties.

  nameplan:          {type: String},
  trialdays:         {type: Number },
  description:       {type: String },
  features:          {type: String },
  timedays:          {type: Number },
  cost:              {type: Number },
  code:              {type: String }, 
  status:            {type: String },
  image:             {type: String },
  createdAt:         {type: Date, default: Date.now}
});

module.exports = mongoose.model('Pack', PackSchema);