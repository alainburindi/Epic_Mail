import Validator from "../../middleware/validator";
import db from "../../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UserController {
    // constructor(){
    //     this.usersList =[];
    // }

    static save(req, res, next){
        const email = req.body.email
        const validate = Validator.schemaSignUp(req.body )
        if(validate.error){
            return res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
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
                    Helper.sendToken(result.rows, res, 201)
                })            
            }
        })
    }

    async checkIfExist(email){
        return this.usersList.find( user => user.email === email );
    }

    find(id){
        return this.usersList.find( user => user.id === id );
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