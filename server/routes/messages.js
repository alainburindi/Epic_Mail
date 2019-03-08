import express from 'express';

const messageRoutes = express.Router()

import checkAuth from '../middleware/check-auth';

import Message from '../models/message'
import MessageController from '../controllers/message';
const messageController = new MessageController()
messageRoutes.get('/', checkAuth, (req, res, next) => {
    res.status(200).json({
        status : 200,
        data :  messageController.getReceivedEmail()
    })
})

messageRoutes.get('/unread', checkAuth, (req, res, next) => {
    res.status(200).json({
        status : 200,
        data :  messageController.getUnreadEmail()
    })
})

messageRoutes.get('/sent', checkAuth, (req, res, next) => {
    res.status(200).json({
        status : 200,
        data :  messageController.getSentEmail()
    })
})

messageRoutes.get('/:id', checkAuth, (req, res, next) => {
    res.status(200).json({
        status : 200,
        data :  messageController.getMessage(req.params.id)
    })
})

messageRoutes.delete('/:id', checkAuth, (req, res, next) => {
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
    messageController.createMessage(req.body).then(result => {
        if (result) {
            res.status(201).json({
                status : 201,
                data : result
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
    
})

export default messageRoutes;
