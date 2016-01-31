var mongoose = require('mongoose');

var foodSchema = new mongoose.Schema({
  brand: String,
  flavor: String
});

mongoose.model('Food', foodSchema);

var AnimalSchema = new mongoose.Schema({
  name:           String,
  breed:          String,
  dob:            { type: Date, default: Date.now },
  gender:         { type: String },
  family:         { type: String },
  status:         { type: String, enum: ["adopted", "orphan"] },
  foods:          [foodSchema]
});

mongoose.model('Animal', AnimalSchema);
