const request = require('supertest');
const chai = require('chai');

const server = require('../../src/server');

const agent = request.agent(server);
const { expect } = chai;

const pass = Math.random().toString(36).substring(2, 15) + Math
    .random().toString(36).substring(2, 15);
const mail = `${Math.random().toString(36).substring(2, 15) + Math
    .random().toString(36).substring(2, 15)}@mail.mm`;

describe('Component -> controller', () => {
    it('/register', (done) => {
        agent.post('/register')
            .send({
                id: mail,
                password: pass,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('data');

                done();
            })
            .catch((err) => done(err));
    });


    it('/login', (done) => {
        agent.post('/login')
            .send({
                id: mail,
                password: pass,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('data').and.to.be.equal('Log in');
                expectBody.to.have.property('token').and.to.be.a('string');

                done();
            })
            .catch((err) => done(err));
    });


    it('/info', (done) => {
        agent.get('/info')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                const expectBody = expect(res.body);

                expectBody.to.have.property('id').and.to.be.a('string');
                expectBody.to.have.property('idType').and.to.be.a('string');

                done();
            })
            .catch((err) => done(err));
    });

    it('/latency', (done) => {
        agent.get('/latency')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                const expectBody = expect(res.body);

                expectBody.to.have.property('answer');

                done();
            })
            .catch((err) => done(err));
    });

    it('/register (invalid params)', (done) => {
        agent.post('/register')
            .send({
                email: 123,
                password: '123',
            })
            .expect('Content-Type', /json/)
            .expect(422)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('message')
                    .and.to.be.equal('E_MISSING_OR_INVALID_PARAMS');

                done();
            })
            .catch((err) => done(err));
    });

    it('/login (invalid params)', (done) => {
        agent.post('/login')
            .send({
                id: 'thisIsMy@mail.com',
                password: 'pit',
            })
            .expect('Content-Type', /json/)
            .expect(418)
            .then((res) => {
                const expectBody = expect(res.body);
                expectBody.to.have.property('data')
                    .and.to.be.equal('Incorrect password');

                done();
            })
            .catch((err) => done(err));
    });

    it('/logout', (done) => {
        agent.get('/logout?all=false')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                const expectBody = expect(res.body);

                expectBody.and.to.have.property('data').and.to.be.equal('log out');

                done();
            })
            .catch((err) => done(err));
    });
});
