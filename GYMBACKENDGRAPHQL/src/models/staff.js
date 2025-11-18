const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  
  name:      {type: String},
  email:     {type: String, require: true, unique: true  },
  age:       {type: Number, require: true },
  id_card:   {type: String, require: true },
  phone:     {type: String, require: true },
  address:   {type: String, require: true },
  gender:    {type: String, require: true },
  field:     {type: String, require: true },
  image:     {type: String, require: true },
  createdAt: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Staff', StaffSchema);