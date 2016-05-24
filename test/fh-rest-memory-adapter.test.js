'use strict';

var expect = require('chai').expect;

describe(__filename, function () {

  var mod;

  beforeEach(function () {
    mod = require('../lib/fh-rest-memory-adapter')();
  });

  describe('#create', function () {
    it('should create an entry in the store', function (done) {
      var inData = {
        key: 'value'
      };

      mod.create({
        data: inData
      }, function (err, data) {
        expect(err).to.not.exist;
        expect(data).to.be.an('object');
        expect(data.uid).to.be.a('string');
        expect(data.data).to.deep.equal(inData);
        done();
      });
    });
  });

  describe('#read', function () {
    it('should read an entry', function (done) {
      var inData = {
        key: 'value'
      };

      mod.create({
        data: inData
      }, function (err, res) {
        expect(err).to.not.exist;
        mod.read({
          id: res.uid
        }, function (err, data) {
          expect(err).to.not.exist;
          expect(data).to.be.an('object');
          expect(data).to.deep.equal(inData);
          done();
        });
      });
    });

    it('should return null', function (done) {
      mod.read({
        id: '123'
      }, function (err, data) {
        expect(err).to.not.exist;
        expect(data).to.not.exist;
        done();
      });
    });
  });

  describe('#update', function () {
    it('should create an entry and update it', function (done) {
      var inData = {
        key: 'value'
      };

      mod.create({
        data: inData
      }, function (err, res) {
        expect(err).to.not.exist;

        mod.update({
          id: res.uid,
          data: {
            key: 'new value'
          }
        }, function (err, data) {
          expect(err).to.not.exist;
          expect(data).to.be.an('object');
          expect(data.key).to.equal('new value');
          done();
        });
      });
    });
  });

  describe('#list', function () {
    it('should return entries', function (done) {
      mod.create({
        data: {
          name: 'evan'
        }
      }, function (err) {
        expect(err).to.not.exist;
        mod.list({}, function (err, items) {
          expect(err).to.not.exist;
          expect(Object.keys(items)).to.have.length(1);
          expect(items[1]).to.deep.equal({
            name: 'evan'
          });
          done();
        });
      });
    });
  });

  describe('#delete', function () {
    it('should create an entry and remove it', function (done) {
      mod.create({
        data: {
          name: 'evan'
        }
      }, function (err, res) {
        mod.delete({
          id: res.uid
        }, function (err) {
          expect(err).to.not.exist;

          mod.list({}, function (err, items) {
            expect(err).to.not.exist;
            expect(Object.keys(items)).to.have.length(0);

            done();
          });
        });
      });
    });

    it('should return null', function (done) {
      mod.delete({
        id: '123'
      }, function (err, res) {
        expect(err).to.not.exist;
        expect(res).to.not.exist;

        done();
      });
    });
  });


});
