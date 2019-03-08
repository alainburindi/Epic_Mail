import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import checkAuth from '../middleware/check-auth';

import UserController from '../controllers/user';

const userRoutes = express.Router()
const userController = new UserController()

import User from '../models/user';

userRoutes.get('/', checkAuth, (req, res, next) => {
    res.status(200).json({
        users : userController.usersList, 
        user : req.userData
    })
})

function validateEmail(mail) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
    return (true)
  }
    return (false)
}

userRoutes.post('/signup', (req, res, next) => {

    const email = req.body.email
    if(validateEmail(email)){
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
    }else{
        return res.status(409).json({
            status : 409,
            error : 'invalid email address'
        })
    }
})

userRoutes.post('/login', (req, res, next) => {
    const email = req.body.email
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
