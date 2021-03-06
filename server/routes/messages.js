import express from 'express';

const messageRoutes = express.Router()

import checkAuth from '../middleware/check-auth';

import Message from '../models/message'
import MessageController from '../controllers/message';
import Validator from '../middleware/validator';
import auth from '../middleware/check-auth'
import {userController} from './user';


const messageController = new MessageController()

messageRoutes.get('/', checkAuth, (req, res, next) => {
    const message = messageController.getReceivedEmail(req.userData.userId);
    returnMessage(message, res)
})

messageRoutes.get('/unread', checkAuth, (req, res, next) => {
    const message = messageController.getUnreadEmail(req.userData.userId)
        returnMessage(message, res)
})

messageRoutes.get('/sent', checkAuth, (req, res, next) => {
    const message = messageController.getSentEmail(req.userData.userId)
        returnMessage(message, res)
})

messageRoutes.get('/:id', checkAuth, (req, res, next) => {
    const validate = Validator.schemaParamsId(req.params )
    if(validate.error){
        validationError(res, validate.error)
    }
    const message = messageController.getMessage(req.params.id)
    res.status(200).json({
        status : 200,
        data :  message ? message : "message not found"
    })
})

messageRoutes.delete('/:id', checkAuth, (req, res, next) => {
    const validate = Validator.schemaParamsId(req.params )
    if(validate.error){
        validationError(res, validate.error)
    }
    if (messageController.deleteMessage(req.params.id)) {
        res.status(200).json({
            status : 200,
            data :  [{ message : "deleted correctly"}]
        })
    }else{
        res.status(500).json({
            status : 500,
            data : [{message : "the action didn't perform correctly, try again later or check the id"}]
        })
    }    
})

messageRoutes.post('/', checkAuth, (req, res, next) => {
    const validate = Validator.schemaMessage(req.body )
    if(validate.error){
        validationError(res, validate.error)
    }
    const email = req.body.to
    userController.checkIfExist(email).then(result => {
        if(result){
            if (!req.body.subject){
                req.body.subject = 'no-subject'
            }
            req.body.to = result.id
            messageController.createMessage(req).then(result => {
                if (result) {
                    res.status(201).json({
                        status : 201,
                        data : result
                    })
                }
            })
        }else{
            return res.status(404).json({
                status : 404,
                error : `${req.body.to} not found, make sure you typed a registered user`, 
            })
        }
    })
})

function returnMessage(message, res) {
    res.status(200).json({
        status : 200,
        data :  message.length > 0  ? message : "no message for you"
    })
}

function validationError(res, error) {
     res.status(422).json({
        status : 422 ,
        error : error
    })
}
export default messageRoutes;
