const Joi = require('@hapi/joi');


function logIn(data) {
    return Joi
        .object({
            id: Joi
                .string()
                .min(4)
                .max(30),
            password: Joi
                .string()
                .min(1)
                .max(30)
                .required(),
        })
        .validate(data);
}

/**
     * @param {Object} data - objectId
     * @returns
     * @memberof AuthValidation
     */
function signUp(data) {
    return Joi
        .object({
            id: Joi
                .string()
                .min(4)
                .max(30),
            password: Joi
                .string()
                .min(1)
                .max(30)
                .required(),
            idType: Joi
                .string(),
        })
        .validate(data);
}

module.exports = {
    logIn,
    signUp,
};
