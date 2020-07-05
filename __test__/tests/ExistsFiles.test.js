const chai = require('chai');
const path = require('path');

// expect path
chai.use(require('chai-fs'));

const { expect } = chai;

describe('EXIST FILES', () => {
    it('CodeStyle', (done) => {
        expect(path.join(__dirname, '../../.eslintrc.json')).to.be.a.path();

        done();
    });
    it('Dotenv', (done) => {
        expect(path.join(__dirname, '../../.env')).to.be.a.path();

        done();
    });
    it('Nodemon', (done) => {
        expect(path.join(__dirname, '../../nodemon.json')).to.be.a.path();

        done();
    });
    it('PackageJson', (done) => {
        expect(path.join(__dirname, '../../package.json')).to.be.a.path();

        done();
    });
});
