const { MongoClient } = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.MONGO_URI);
let db;
const connectDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db('IPAdb');
  }
  return db;
};
const getCollection = async (collectionName) => {
  if (!db) await connectDB();
  return db.collection(collectionName);
};
module.exports = { connectDB, getCollection };
