import Validator from "../../middleware/validator";
import db from "../../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UserController {
    static save(req, res, next){
        const email = req.body.email
        const validate = Validator.schemaSignUp(req.body )
        if(validate.error){
            return res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        //check if email is already in use
        const sql = "SELECT * FROM Users WHERE email = $1";
        db(sql, [email], (err, result) => {
            if(err){
                return next(err)
            }
            if(result.rowCount != 1){
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status : 500,
                        error : err+""
                    })
                }else{
                    const query = "INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
                    const {name, email} = req.body;
                    const values = [
                        name,
                        email,
                        hash
                    ]
                    db(query, values, (err, result) => {
                        if(err){
                            return next(err)
                        }
                        Helper.sendToken(result.rows[0], res, 201)
                    })            
                }
                })
            }else{
                return res.status(409).json({
                    status : 409,
                    error : 'user with the same email already exists'
                })
            }
        })
    }

    static login(req, res, next){
        const validate = Validator.schemaSignIn(req.body )
        if(validate.error){
            return res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const {email, password} = req.body
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    status : 500,
                    error : err+""
                })
            }else{
                const query = "SELECT * FROM Users WHERE email = $1";
                const values = [email]
                db(query, values, (err, result) => {
                    if(err)
                    return next(err)
                    if(result.rowCount != 1)
                    return res.status(401).json({
                        status : 401,
                        error : 'Authentication failed, please check your credentials'
                    })
                    const isValid = bcrypt.compareSync(password, result.rows[0].password)
                    if (isValid){
                        Helper.sendToken(result.rows[0], res, 200)
                    }else{
                        return res.status(401).json({
                            status : 401,
                            error : 'Authentication failed, please check your credentials'
                        })
                    }
                })
            }
        });
    }
}

class Helper {
    static sendToken  (user, res, status){
        const token = jwt.sign(
            {
                email : user.email,
                userId : user.id
            }, 
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h"
            }
        )
        return res.status(status).json({
            status : status,
            data : [{token : token}]
        })
    }
}