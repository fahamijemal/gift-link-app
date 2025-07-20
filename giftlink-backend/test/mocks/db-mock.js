const { ObjectId } = require('mongodb');

// Mock database connection for testing
const mockConnectToDatabase = async () => {
  return {
    collection: (name) => {
      if (name === 'gifts') {
        return {
          find: () => ({
            toArray: async () => [
              {
                _id: new ObjectId('507f1f77bcf86cd799439011'),
                name: 'Test Gift 1',
                condition: 'New',
                date_added: Math.floor(Date.now() / 1000),
                description: 'A test gift'
              },
              {
                _id: new ObjectId('507f1f77bcf86cd799439012'),
                name: 'Test Gift 2',
                condition: 'Used',
                date_added: Math.floor(Date.now() / 1000),
                description: 'Another test gift'
              }
            ]
          }),
          findOne: async (query) => {
            if (query._id && query._id.toString() === '507f1f77bcf86cd799439011') {
              return {
                _id: new ObjectId('507f1f77bcf86cd799439011'),
                name: 'Test Gift 1',
                condition: 'New',
                date_added: Math.floor(Date.now() / 1000),
                description: 'A test gift'
              };
            }
            return null;
          },
          insertOne: async (data) => ({
            insertedId: new ObjectId('507f1f77bcf86cd799439013'),
            ops: [data]
          })
        };
      } else if (name === 'users') {
        return {
          findOne: async (query) => {
            if (query.email === 'test@example.com') {
              return {
                _id: new ObjectId('507f1f77bcf86cd799439014'),
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                password: '$2a$10$test.hash.for.testing',
                createdAt: new Date()
              };
            }
            return null;
          },
          insertOne: async (data) => ({
            insertedId: new ObjectId('507f1f77bcf86cd799439015')
          }),
          findOneAndUpdate: async (filter, update, options) => ({
            value: {
              _id: new ObjectId('507f1f77bcf86cd799439014'),
              email: 'test@example.com',
              firstName: 'Updated',
              lastName: 'User',
              updatedAt: new Date()
            }
          })
        };
      }
      return {
        find: () => ({ toArray: async () => [] }),
        findOne: async () => null,
        insertOne: async (data) => ({ insertedId: new ObjectId() })
      };
    }
  };
};

module.exports = mockConnectToDatabase;