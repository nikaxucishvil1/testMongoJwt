const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userModel = new Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  linksArr: {
    type: Object,
    require: true,
  },
});

module.exports = mongoose.model("User", userModel);
