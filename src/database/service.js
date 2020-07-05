const AuthModel = require('./model');

/**
 * @exports
 * @method signUp
 * @param {object} profile
 * @summary create a new user in database
 * @returns {Promise<void>}
 */
function signUp(profile) {
    return AuthModel.create(profile);
}

/**
 * @exports
 * @method info
 * @param {string} id
 * @summary gives info about user
 * @returns {Promise<void>}
 */
function info(id) {
    return AuthModel.find({ id }).exec();
}

module.exports = {
    signUp,
    info,
};
