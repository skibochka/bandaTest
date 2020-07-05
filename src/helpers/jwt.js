const jwt = require('jsonwebtoken');

const privateKey = process.env.KEY;

/**
 * @function
 * @param  data
 * @returns  created token
 */
function getToken(data) {
    const token = {
        refresh: jwt.sign({ id: data.id }, privateKey, { expiresIn: '24h' }),
        access: jwt.sign({ id: data.id }, privateKey, { expiresIn: '2m' }),
    };
    return token;
}

/**
 * @function
 * @param  token
 * @returns  token status
 */
function verify(token) {
    try {
        const refresh = jwt.verify(token.Refresh, process.env.KEY);
        try {
            const access = jwt.verify(token.Access, process.env.KEY);
            if (refresh && access) {
                return { status: 0, id: access.id };
            }
        } catch (err) {
            return { status: 1 };
        }
    } catch (err) {
        return { status: 2 };
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns new token
 */
function tokenMiddleware(req, res, next) {
    const data = {
        Access: req.cookies.Access,
        Refresh: req.cookies.Refresh,
    };
    const response = verify(data);
    if (response.status === 1) {
        const accessData = {
            id: response.id,
        };
        const { access } = getToken(accessData);
        res.cookie('Access', access, {
            maxAge: 300000,
            httpOnly: true,
        });
        return res.redirect(307, req.path);
    }
    if (response.status === 2) {
        return res.status(401).json({
            message: 'please login',
        });
    }
    if (req.path === '/logout') {
        res.cookie('Access', 0, {
            maxAge: 0,
            httpOnly: true,
        });
        res.cookie('Refresh', 0, {
            maxAge: 0,
            httpOnly: true,
        });
    }
    req.id = response.id;


    next();
}
module.exports = {
    getToken,
    verify,
    tokenMiddleware,
};
