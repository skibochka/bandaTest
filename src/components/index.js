const request = require('request');
const bcrypt = require('bcrypt');
const Service = require('../database/service');
const Validation = require('../helpers/validation');
const ValidationError = require('../helpers/ValidationError');
const jwt = require('../helpers/jwt');

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function logIn(req, res, next) {
    try {
        const { error } = Validation.logIn(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }
        const hash = await Service.info(req.body.id);
        bcrypt.compare(req.body.password, hash[0].password, (err, result) => {
            if (result === true) {
                const data = {
                    id: req.body.id,
                };
                const { refresh } = jwt.getToken(data);
                const { access } = jwt.getToken(data);

                res.cookie('Access', access, { maxAge: 120000, httpOnly: true });
                res.cookie('Refresh', refresh, { maxAge: 86400000, httpOnly: true });

                return res.status(200).json({
                    data: 'Log in',
                    token: access,
                });
            }
            return res.status(418).json({
                data: 'Incorrect password',
            });
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function signUp(req, res, next) {
    try {
        if (/@/.test(req.body.id) === true) {
            req.body.idType = 'email';
        } else {
            req.body.idType = 'phone number';
        }
        const { error } = Validation.signUp(req.body);
        if (error) {
            throw new ValidationError(error.details);
        }
        const salt = bcrypt.genSaltSync(5);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        await Service.signUp(req.body);
        res.redirect(307, '/login');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function logOut(req, res, next) {
    try {
        if (req.query.all === 'true') {
            process.env.KEY = Math.random().toString(36).substring(2, 15) + Math
                .random().toString(36).substring(2, 15);
        } else {
            res.cookie('Access', 0, { maxAge: 0, httpOnly: true });
            res.cookie('Refresh', 0, { maxAge: 0, httpOnly: true });
        }
        return res.status(200)
            .json({
                data: 'log out',
            });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422)
                .json({
                    message: error.name,
                    details: error.message,
                });
        }

        res.status(500)
            .json({
                message: error.name,
                details: error.message,
            });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function info(req, res, next) {
    try {
        const user = await Service.info(req.id);
        return res.status(200).json({
            id: user[0].id,
            idType: user[0].idType,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function latency(req, res, next) {
    try {
        request({
            uri: 'https://www.google.com',
            method: 'GET',
            time: true,
        }, (err, resp) => res.status(200).json({
            answer: resp.timings,
        }));
    } catch (error) {
        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

module.exports = {
    logIn,
    signUp,
    logOut,
    info,
    latency,
};
