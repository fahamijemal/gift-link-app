const { ObjectId } = require('mongodb');

// Mock database collections
const mockGifts = [
  {
    _id: new ObjectId('507f1f77bcf86cd799439011'),
    name: 'Test Gift 1',
    condition: 'New',
    date_added: Math.floor(Date.now() / 1000),
    description: 'A test gift for testing purposes',
    price: 25.99,
    category: 'Electronics'
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439012'),
    name: 'Test Gift 2',
    condition: 'Used',
    date_added: Math.floor(Date.now() / 1000),
    description: 'Another test gift',
    price: 15.50,
    category: 'Books'
  }
];

const mockUsers = [
  {
    _id: new ObjectId('507f1f77bcf86cd799439013'),
    email: 'test@example.com',
    password: '$2a$10$test.hash.for.testing',
    name: 'Test User',
    date_created: Math.floor(Date.now() / 1000)
  }
];

// Mock database connection
const mockConnectToDatabase = async () => {
  return {
    collection: (name) => {
      if (name === 'gifts') {
        return {
          find: (query = {}) => ({
            toArray: async () => {
              if (query._id) {
                const gift = mockGifts.find(g => g._id.toString() === query._id.toString());
                return gift ? [gift] : [];
              }
              return mockGifts;
            }
          }),
          findOne: async (query) => {
            if (query._id) {
              return mockGifts.find(g => g._id.toString() === query._id.toString()) || null;
            }
            return mockGifts[0] || null;
          },
          insertOne: async (doc) => {
            const newGift = {
              _id: new ObjectId(),
              ...doc,
              date_added: Math.floor(Date.now() / 1000)
            };
            mockGifts.push(newGift);
            return { insertedId: newGift._id };
          },
          updateOne: async (query, update) => {
            const index = mockGifts.findIndex(g => g._id.toString() === query._id.toString());
            if (index !== -1) {
              mockGifts[index] = { ...mockGifts[index], ...update.$set };
              return { modifiedCount: 1 };
            }
            return { modifiedCount: 0 };
          },
          deleteOne: async (query) => {
            const index = mockGifts.findIndex(g => g._id.toString() === query._id.toString());
            if (index !== -1) {
              mockGifts.splice(index, 1);
              return { deletedCount: 1 };
            }
            return { deletedCount: 0 };
          }
        };
      } else if (name === 'users') {
        return {
          find: (query = {}) => ({
            toArray: async () => {
              if (query.email) {
                const user = mockUsers.find(u => u.email === query.email);
                return user ? [user] : [];
              }
              return mockUsers;
            }
          }),
          findOne: async (query) => {
            if (query.email) {
              return mockUsers.find(u => u.email === query.email) || null;
            }
            if (query._id) {
              return mockUsers.find(u => u._id.toString() === query._id.toString()) || null;
            }
            return mockUsers[0] || null;
          },
          insertOne: async (doc) => {
            const newUser = {
              _id: new ObjectId(),
              ...doc,
              date_created: Math.floor(Date.now() / 1000)
            };
            mockUsers.push(newUser);
            return { insertedId: newUser._id };
          },
          updateOne: async (query, update) => {
            const index = mockUsers.findIndex(u => u._id.toString() === query._id.toString());
            if (index !== -1) {
              mockUsers[index] = { ...mockUsers[index], ...update.$set };
              return { modifiedCount: 1 };
            }
            return { modifiedCount: 0 };
          }
        };
      }
      return {
        find: () => ({ toArray: async () => [] }),
        findOne: async () => null,
        insertOne: async () => ({ insertedId: new ObjectId() }),
        updateOne: async () => ({ modifiedCount: 0 }),
        deleteOne: async () => ({ deletedCount: 0 })
      };
    }
  };
};

module.exports = {
  mockConnectToDatabase,
  mockGifts,
  mockUsers
};