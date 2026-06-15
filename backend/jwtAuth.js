const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401).json({
            message: "Unauthorized"
         });;

    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_PASSWORD, (err, data) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.sendStatus(403); // Forbidden
        }
        req.userID = data; // Optionally set user data in request
        next();
    });
}