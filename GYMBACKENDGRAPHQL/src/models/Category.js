const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({

    name:        {type: String, require: true  },
    description: {type:String },
    image:       {type:String },
    createdAt:   {type: Date, default: Date.now}
    
});

module.exports = mongoose.model('Category', CategorySchema);