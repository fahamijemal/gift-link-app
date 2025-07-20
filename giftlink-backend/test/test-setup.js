const { mockConnectToDatabase } = require('./mocks/database');

// Mock the database module before any routes are loaded
const originalModule = require('../models/db');
originalModule.connectToDatabase = mockConnectToDatabase;

// Export the mocked module
module.exports = {
  mockConnectToDatabase,
  originalModule
};