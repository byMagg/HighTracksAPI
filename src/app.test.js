const request = require("supertest");

const app = require("./app");

describe("GET /", () => {
    it('obtains token from spotify', (done) => {
        request(app)
            .get('/api/generate_token')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).toHaveProperty('access_token');
                expect(res.body).toHaveProperty('token_type');
                expect(res.body).toHaveProperty('expires_in');
                done();
            });
    });
});
