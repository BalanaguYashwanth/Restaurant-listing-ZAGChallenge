const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
  } catch (err) {
    console.log(err);
    throw new Error('Unable to connect mongo')
  }
};

module.exports = connectDb;
