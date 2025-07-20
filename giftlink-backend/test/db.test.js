const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

describe('Database Connection Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Database Connection', () => {
    it('should handle connection errors gracefully', async () => {
      // Mock MongoDB connection to fail
      const mockConnect = sandbox.stub(MongoClient, 'connect').rejects(new Error('Connection failed'));
      
      try {
        const connectToDatabase = require('../models/db');
        await connectToDatabase();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Connection failed');
      }
    });

    it('should connect successfully with valid URL', async () => {
      // Mock successful connection
      const mockDb = {
        collection: sandbox.stub().returns({
          find: sandbox.stub().returns({
            toArray: sandbox.stub().resolves([])
          })
        })
      };
      
      const mockClient = {
        db: sandbox.stub().returns(mockDb),
        close: sandbox.stub()
      };
      
      sandbox.stub(MongoClient, 'connect').resolves(mockClient);
      
      const connectToDatabase = require('../models/db');
      const db = await connectToDatabase();
      
      expect(db).to.equal(mockDb);
    });
  });
});