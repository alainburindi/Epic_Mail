import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import checkAuth from '../middleware/check-auth';

import UserController from '../controllers/user';
import Validator from '../middleware/validator';




const userRoutes = express.Router()
const userController = new UserController()

import User from '../models/user';

userRoutes.get('/', checkAuth, (req, res, next) => {
    res.status(200).json({
        users : userController.usersList, 
        user : req.userData
    })
})

userRoutes.post('/signup', (req, res, next) => {
    const email = req.body.email
    const validate = Validator.schemaSignUp(req.body )
    if(validate.error){
        return res.status(422).json({
            status : 422 ,
            error : validate.error
        })
    }
    userController.checkIfExist(email).then(result =>{
        if(result){
            return res.status(409).json({
                status : 409,
                error : 'user with the same email already exists'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status : 500,
                        error : error+""
                    })
                }else{
                    const user = new User(1, req.body.name, req.body.email, hash)
                    userController.save(user).then(result => {
                        const token = jwt.sign(
                            {
                                email :user.email,
                                userId : user.id
                            }, 
                            "alainsecretkey",
                            {
                                expiresIn: "1h"
                            }
                        )
                        res.status(201).json({
                            status : 201,
                            data : [{token : token}]
                        })
                    }).catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error : err
                        })
                    })
                }
            })
        }
    })
})

userRoutes.post('/login', (req, res, next) => {
    const email = req.body.email
    const validate = Validator.schemaSignIn(req.body )
    if(validate.error){
        return res.status(422).json({
            status : 422 ,
            error : validate.error
        })
    }
    userController.checkIfExist(email).then(user => {
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        status : 401,
                        error : 'Authentication failed, please check your credentials'
                    })
                }
                if (result){
                    const token = jwt.sign(
                        {
                            email : user.email,
                            userId : user.id
                        }, 
                        "alainsecretkey",
                        {
                            expiresIn: "1h"
                        }
                    )
                    res.status(200).json({
                        status : 200,
                        data : [{token : token}]
                    })
                }else{
                    return res.status(401).json({
                        status : 401,
                        error : 'Authentication failed, please check your credentials'
                    })
                }
            })
            
        }else{
            return res.status(401).json({
                status : 401,
                error : 'Authentication failed, please check your credentials'
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})
export default userRoutes;
