const { Router } = require('express');
const AuthComponent = require('./index');
const jwt = require('../helpers/jwt.js');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route login a user
 * @name /login
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/login', AuthComponent.logIn);

/**
 * Route register a new user
 * @name /register
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/register', AuthComponent.signUp);

/**
 * Route logout a user
 * @name /logOut
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/logout', jwt.tokenMiddleware, AuthComponent.logOut);

/**
 * Route gives info about a user
 * @name /info
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/info', jwt.tokenMiddleware, AuthComponent.info);

/**
 * Route returns service server latency for google.com
 * @name /latency
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/latency', jwt.tokenMiddleware, AuthComponent.latency);


module.exports = router;
