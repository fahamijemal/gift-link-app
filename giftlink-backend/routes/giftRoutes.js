/* jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // To convert string ID to MongoDB ObjectId
const connectToDatabase = require('../models/db'); // Import database connection utility

/**
 * @route   GET /api/gifts
 * @desc    Fetch all gift documents from the 'gifts' collection
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        // Connect to the MongoDB database
        const db = await connectToDatabase();

        // Access the 'gifts' collection
        const collection = db.collection("gifts");

        // Fetch all gift documents and convert them to a JSON array
        const gifts = await collection.find({}).toArray();

        // Send the array of gifts in the response
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

/**
 * @route   GET /api/gifts/:id
 * @desc    Fetch a single gift by its ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        // Connect to the MongoDB database
        const db = await connectToDatabase();

        // Access the 'gifts' collection
        const collection = db.collection("gifts");

        // Extract the ID from the request parameters
        const id = req.params.id;

        // Attempt to find the gift by its ObjectId
        const gift = await collection.findOne({ _id: new ObjectId(id) });

        // If no gift is found, return 404
        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        // Return the gift document
        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});

/**
 * @route   POST /api/gifts
 * @desc    Add a new gift to the database
 * @access  Public
 */
router.post('/', async (req, res, next) => {
    try {
        // Connect to the MongoDB database
        const db = await connectToDatabase();

        // Access the 'gifts' collection
        const collection = db.collection("gifts");

        // Insert the request body as a new document
        const result = await collection.insertOne(req.body);

        // Respond with the inserted gift (compatible with older and newer MongoDB drivers)
        res.status(201).json(result.ops ? result.ops[0] : { insertedId: result.insertedId });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
