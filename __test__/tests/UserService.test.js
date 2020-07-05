const chai = require('chai');
const Service = require('../../src/database/service');

const { expect } = chai;

const password = Math.random().toString(36).substring(2, 15) + Math
    .random().toString(36).substring(2, 15);
const id = `${Math.random().toString(36).substring(2, 15) + Math
    .random().toString(36).substring(2, 15)}@mail.mm`;

describe('Database -> service', () => {
    it('signUp', async () => {
        const data = {
            id,
            password,
            idType: 'email',
        };
        const res = await Service.signUp(data);
        expect(res).to.be.a('object');
    });
    it('info', async () => {
        const res = await Service.info(id);
        expect(res).to.be.a('array');
    });
});
