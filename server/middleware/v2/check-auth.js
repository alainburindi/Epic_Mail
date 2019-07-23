import jwt from 'jsonwebtoken';
import db from '../../db/db';

export default (req, res, next) => {
    try {
        const token = req.headers.uthorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        req.userData = decoded
        return next()
    } catch (error) {        
        return res.status(401).json({
            status : 401,
            error : 'Authentication failed, please check your credentials'
        })
    }
}
