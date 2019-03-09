import jwt from 'jsonwebtoken';

export let auth;

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "alainsecretkey")
        req.userData = decoded
       auth = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            status : 401,
            error : 'Authentication failed, please check your credentials'
        })
    }
}
