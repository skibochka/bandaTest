const { Schema } = require('mongoose');
const connections = require('./connection');

const AuthSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        idType: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'authmodel',
        versionKey: false,
    },
);
module.exports = connections.model('AuthModel', AuthSchema);
