import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dontenv from 'dotenv';
dontenv.config()

import checkAuth from '../middleware/check-auth';

import UserController from '../controllers/user';
import Validator from '../middleware/validator';




const userRoutes = express.Router()
export const userController = new UserController()

import User from '../models/user';

userRoutes.get('/', checkAuth, (req, res, next) => {
    res.status(200).json({
        users : userController.usersList, 
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
                    let id 
                    if(userController.usersList.length != 0){
                        id = userController.usersList[userController.usersList.length-1].id+1
                    }else{
                        id = 1
                    }
                    const user = new User(id, req.body.name, req.body.email, hash)
                    userController.save(user).then(result => {
                        sendToken(user, res, 201)
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
                    authFails(res);
                }
                if (result){
                    sendToken(user, res, 200)
                }else{
                    authFails(res);
                }
            })
            
        }else{
            authFails(res);
        }
    })
})

function sendToken(user, res, status) {
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

function authFails(res) {
    return res.status(401).json({
        status : 401,
        error : 'Authentication failed, please check your credentials'
    })
}


export default userRoutes;
