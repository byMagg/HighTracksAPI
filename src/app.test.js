const request = require("supertest");

const app = require("./app");
const mongoose = require('mongoose');

describe("GET /", () => {
    it('obtains token from Spotify', async () => {
        const response = await request(app)
            .get('/api/generate_token')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('token_type');
        expect(response.body).toHaveProperty('expires_in');
    });

});

afterAll(async () => {
    await mongoose.disconnect();
});
