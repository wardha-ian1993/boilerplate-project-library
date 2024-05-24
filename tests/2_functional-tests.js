/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({ title: 'Testing book'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'Testing book');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({ title: '' })
          .end(function(err, res) {
            assert.equal(res.body, 'missing required field title');
            done();
          });
      });
      
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isObject(res.body[0]);
            done();
          });
      });

    });

    const validId = '66508b0ee66adda006c67f98';
    const testId = '66508bf2e66adda006c67fa8';

    const deletedId = '665088fbdf4b60f8a1456f2f';
    
    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books/${deletedId}`)
          .end(function(err, res) {
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books/${validId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.equal(res.body.title, 'Adding book');
            done();
          });
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done) {
        chai
          .request(server)
          .post(`/api/books/${testId}`)
          .send({ comment: 'Test comments' })
          .end(function(err, res) {
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.equal(res.body.comments[res.body.comments.length - 1], 'Test comments');
            done();
          });
      });
      

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${testId}`)
          .send({ comment: '' })
          .end(function(err, res) {
            assert.equal(res.body, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${deletedId}`)
          .send({ comment: 'Test comments' })
          .end(function(err, res) {
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${testId}`)
          .end(function(err, res) {
            assert.equal(res.body, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${deletedId}`)
          .end(function(err, res) {
            assert.equal(res.status, 404);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

    });

  });

});
