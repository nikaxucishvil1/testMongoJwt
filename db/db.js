const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true });
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
};
