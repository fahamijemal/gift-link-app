const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require('sinon');
const app = require('../app');

chai.use(chaiHttp);

describe('Gift-Link Backend API Tests', () => {
  let server;

  before(() => {
    server = app.listen(0); // Use random port for testing
  });

  after(() => {
    server.close();
  });

  describe('Health Check', () => {
    it('should return server status', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('Inside the server');
          done();
        });
    });
  });

  describe('Gift Routes', () => {
    describe('GET /api/gifts', () => {
      it('should return all gifts', (done) => {
        chai.request(server)
          .get('/api/gifts')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
      });
    });

    describe('GET /api/gifts/:id', () => {
      it('should return 404 for non-existent gift', (done) => {
        const fakeId = '507f1f77bcf86cd799439011';
        chai.request(server)
          .get(`/api/gifts/${fakeId}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });

      it('should return 500 for invalid ID format', (done) => {
        chai.request(server)
          .get('/api/gifts/invalid-id')
          .end((err, res) => {
            expect(res).to.have.status(500);
            done();
          });
      });
    });

    describe('POST /api/gifts', () => {
      it('should create a new gift', (done) => {
        const newGift = {
          name: 'Test Gift',
          condition: 'New',
          date_added: Math.floor(Date.now() / 1000),
          description: 'A test gift for testing purposes'
        };

        chai.request(server)
          .post('/api/gifts')
          .send(newGift)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('insertedId');
            done();
          });
      });
    });
  });

  describe('Authentication Routes', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user', (done) => {
        const newUser = {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'password123'
        };

        chai.request(server)
          .post('/api/auth/register')
          .send(newUser)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('authtoken');
            expect(res.body).to.have.property('email');
            done();
          });
      });

      it('should return 400 for duplicate email', (done) => {
        const duplicateUser = {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'password123'
        };

        chai.request(server)
          .post('/api/auth/register')
          .send(duplicateUser)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });

    describe('POST /api/auth/login', () => {
      it('should login with valid credentials', (done) => {
        const loginData = {
          email: 'test@example.com',
          password: 'password123'
        };

        chai.request(server)
          .post('/api/auth/login')
          .send(loginData)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('authtoken');
            expect(res.body).to.have.property('userName');
            expect(res.body).to.have.property('userEmail');
            done();
          });
      });

      it('should return 404 for non-existent user', (done) => {
        const loginData = {
          email: 'nonexistent@example.com',
          password: 'password123'
        };

        chai.request(server)
          .post('/api/auth/login')
          .send(loginData)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('should return 404 for wrong password', (done) => {
        const loginData = {
          email: 'test@example.com',
          password: 'wrongpassword'
        };

        chai.request(server)
          .post('/api/auth/login')
          .send(loginData)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
  });

  describe('Search Routes', () => {
    describe('GET /api/search', () => {
      it('should return search results', (done) => {
        chai.request(server)
          .get('/api/search')
          .query({ q: 'test' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
      });
    });
  });
});