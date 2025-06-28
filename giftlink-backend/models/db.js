/* jshint esversion: 8 */
/* jshint esversion: 8 */
// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection URL from .env
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url);

    // Connect to MongoDB
    await client.connect();

    //Connect to database giftDB and store in variable dbInstance
    dbInstance = client.db(dbName);

    //Return database instance
    return dbInstance;
}

module.exports = connectToDatabase;
