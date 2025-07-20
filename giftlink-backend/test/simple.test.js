const chai = require('chai');
const expect = chai.expect;

describe('Basic Application Tests', () => {
  describe('Environment Setup', () => {
    it('should have required environment variables', () => {
      expect(process.env.NODE_ENV).to.exist;
      expect(process.env.JWT_SECRET).to.exist;
    });
  });

  describe('Dependencies', () => {
    it('should have express available', () => {
      const express = require('express');
      expect(express).to.be.a('function');
    });

    it('should have bcryptjs available', () => {
      const bcryptjs = require('bcryptjs');
      expect(bcryptjs).to.be.an('object');
      expect(bcryptjs.hash).to.be.a('function');
    });

    it('should have jsonwebtoken available', () => {
      const jwt = require('jsonwebtoken');
      expect(jwt).to.be.an('object');
      expect(jwt.sign).to.be.a('function');
    });

    it('should have mongodb available', () => {
      const { MongoClient } = require('mongodb');
      expect(MongoClient).to.be.a('function');
    });
  });

  describe('Utility Functions', () => {
    it('should format dates correctly', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const date = new Date(timestamp * 1000);
      expect(date).to.be.instanceOf(Date);
      expect(date.getTime()).to.be.greaterThan(0);
    });

    it('should generate ObjectIds', () => {
      const { ObjectId } = require('mongodb');
      const id = new ObjectId();
      expect(id).to.be.instanceOf(ObjectId);
      expect(id.toString()).to.have.lengthOf(24);
    });
  });

  describe('Password Hashing', () => {
    it('should hash passwords', async () => {
      const bcryptjs = require('bcryptjs');
      const password = 'testpassword';
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(password, salt);
      
      expect(hash).to.be.a('string');
      expect(hash).to.not.equal(password);
      expect(hash).to.include('$2a$');
    });

    it('should verify hashed passwords', async () => {
      const bcryptjs = require('bcryptjs');
      const password = 'testpassword';
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(password, salt);
      
      const isValid = await bcryptjs.compare(password, hash);
      expect(isValid).to.be.true;
      
      const isInvalid = await bcryptjs.compare('wrongpassword', hash);
      expect(isInvalid).to.be.false;
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate JWT tokens', () => {
      const jwt = require('jsonwebtoken');
      const payload = { user: { id: '123' } };
      const secret = process.env.JWT_SECRET || 'test-secret';
      
      const token = jwt.sign(payload, secret);
      expect(token).to.be.a('string');
      expect(token.split('.')).to.have.lengthOf(3);
    });

    it('should verify JWT tokens', () => {
      const jwt = require('jsonwebtoken');
      const payload = { user: { id: '123' } };
      const secret = process.env.JWT_SECRET || 'test-secret';
      
      const token = jwt.sign(payload, secret);
      const decoded = jwt.verify(token, secret);
      
      expect(decoded).to.have.property('user');
      expect(decoded.user).to.have.property('id', '123');
    });
  });
});