const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
     // Add schema properties.

  namemember:        {type: String},
  client_CI:         {type: String, require: true },
  email:             {type: String, require: true },
  phone:             {type: String, require: true },
  nameplan:          {type: String, require: true },
  timedays:          {type: Number, require: true },
  cost:              {type: Number, require: true },
  code:              {type: String, require: true },
  status:            {type: String, require: true },
  leftdays:          {type: Number, require: true },
  createdAt:         {type: Date, default: Date.now},
  finishAt:          {type: Date, default: Date.now},
  imageUser:         {type: String, require: true },
  
});

module.exports = mongoose.model('Member', memberSchema);