import express from 'express';

const messageRoutes = express.Router()

import checkAuth from '../middleware/check-auth';

import Message from '../models/message'
import MessageController from '../controllers/message';
import Validator from '../middleware/validator';

const messageController = new MessageController()
messageRoutes.get('/', checkAuth, (req, res, next) => {
    const message = messageController.getReceivedEmail();
    returnMessage(message, res)
})

messageRoutes.get('/unread', checkAuth, (req, res, next) => {
    const message = messageController.getUnreadEmail()
        returnMessage(message, res)
})

messageRoutes.get('/sent', checkAuth, (req, res, next) => {
    const message = messageController.getSentEmail()
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
    if (!req.body.subject){
        req.body.subject = 'no-subject'
    }
    messageController.createMessage(req.body).then(result => {
        if (result) {
            res.status(201).json({
                status : 201,
                data : result
            })
        }else{
            res.status(500).json({
                status : 500,
                error : "error while saving"
            })
        }
    }).catch(err => {
        res.status(500).json({
            error : err
        })
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
