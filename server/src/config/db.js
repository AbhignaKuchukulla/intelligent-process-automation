const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB with URI:", process.env.MONGO_URI);

        if (!db) {
            await client.connect();
            db = client.db("IPAdb"); 
            console.log("✅ MongoDB Atlas connected successfully to IPAdb");
        }
        return db;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

const getCollection = async (collectionName) => {
    if (!db) await connectDB();
    return db.collection(collectionName);
};

module.exports = {
    connectDB,
    getUsersCollection: () => getCollection("users"),
    getSessionsCollection: () => getCollection("sessions"),
    getLogsCollection: () => getCollection("logs"),
    getProductsCollection: () => getCollection("products"),
    getOrdersCollection: () => getCollection("orders")
};
