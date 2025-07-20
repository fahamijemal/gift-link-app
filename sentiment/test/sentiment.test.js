const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../index');

chai.use(chaiHttp);

describe('Sentiment Analysis Service Tests', () => {
  let server;

  before(() => {
    server = app.listen(0);
  });

  after(() => {
    server.close();
  });

  describe('POST /sentiment', () => {
    it('should analyze positive sentiment', (done) => {
      chai.request(server)
        .post('/sentiment')
        .query({ sentence: 'I love this amazing wonderful gift!' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('sentimentScore');
          expect(res.body).to.have.property('sentiment');
          expect(res.body.sentiment).to.equal('positive');
          expect(res.body.sentimentScore).to.be.greaterThan(0.33);
          done();
        });
    });

    it('should analyze negative sentiment', (done) => {
      chai.request(server)
        .post('/sentiment')
        .query({ sentence: 'I hate this terrible awful gift!' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('sentimentScore');
          expect(res.body).to.have.property('sentiment');
          expect(res.body.sentiment).to.equal('negative');
          expect(res.body.sentimentScore).to.be.lessThan(0);
          done();
        });
    });

    it('should analyze neutral sentiment', (done) => {
      chai.request(server)
        .post('/sentiment')
        .query({ sentence: 'This is a gift.' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('sentimentScore');
          expect(res.body).to.have.property('sentiment');
          expect(res.body.sentiment).to.equal('neutral');
          done();
        });
    });

    it('should return 400 for missing sentence', (done) => {
      chai.request(server)
        .post('/sentiment')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No sentence provided');
          done();
        });
    });

    it('should return 400 for empty sentence', (done) => {
      chai.request(server)
        .post('/sentiment')
        .query({ sentence: '' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No sentence provided');
          done();
        });
    });
  });
});