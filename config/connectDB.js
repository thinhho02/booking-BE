import mongoose from "mongoose";
const conn = () => {
  return mongoose.connect(
    process.env.MONGO_CONNECTION_STRING,
    {
      dbName: process.env.MONGO_DB_NAME,
    }
  );
};
export default conn;
