const request = require('supertest');
const assert = require('assert');
const app = require('./old.app').app;

describe('api tests', function () {
    it('should return user', function (done) {
        request(app)
            .get('/api/users/1')
            .expect(function (response) {
                assert.deepEqual(response.body, {"id":1,"name":"Tom","age":24});
            })
            .end(done);
    });
    it('should return NotFound', function (done) {
        request(app)
            .get('/api/users/0')
            .expect(400)
            .end(done);
    });
});
