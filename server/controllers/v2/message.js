import Message from '../../models/message';
import { userController } from '../../routes/user';
import db from '../../db/db'
import Validator from '../../middleware/validator'

export default class MessageController {

    static create(req, res, next){
        const validate = Validator.schemaMessage(req.body )
        if(validate.error){
            res.status(422).json({
                status : 422 ,
                error : error
            })
        }
        const {userId} = req.userData
        let {subject} = req.body
        const { to, message, parentMessageId} = req.body
        //check if email is already in use
        const query = "SELECT * FROM Users WHERE email = $1";
        const values = [to]
        db(query, values, (err, users) => {
            if(err)
                return next(err)
            if(users.rowCount != 1)
                return res.status(404).json({
                    status : 404,
                    error : `${req.body.to} not found, make sure you typed a registered user`, 
                })
            const {id, email} = users.rows[0] 
            const query = "INSERT INTO Messages (subject, message, status, parentMessageId, userId, receiverId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
            if (!subject){
                subject = 'no-subject'
            }
            const values = [
                subject,
                message,
                "unread",
                parentMessageId,
                userId,
                id
            ]
            db(query, values, (err, result) => {
                if(err)
                return next(err)
                if(result.rowCount == 1){
                    delete result.rows[0].userid
                    delete result.rows[0].receiverid
                    result.rows[0].to = email
                    result.rows[0].status = "sent"
                    res.status(201).json({
                        status : 201,
                        data : result.rows[0]
                    })
                }else{
                    res.status(500).json({
                        status : 500,
                        error : "error while saving"
                    })
                }
            })
        })
    }
    getReceivedEmail(userId){
        let received = []
        for (const sent of this.sentMessages) {
            const found = this.messagesList.find( message => message.id === sent.messageId && sent.receiverId === userId)
            if(found != null)
            received.push(found)
        }
        return received;
    }

    getUnreadEmail(userId){
        let unread = []
        for (const sent of this.sentMessages) {
            const found = this.messagesList.find( message => message.id === sent.messageId && sent.receiverId === parseInt(userId, 10)  && sent.status == "unread")
            if(found != null){
               const user =  userController.find(found.userId)
                if(user){
                    delete found.userId
                    found["from"] = user.email
                }
                found["status"] = sent.status
                unread.push(found)
            }
        }
        return unread;
    }

    getSentEmail(userId){
        let sent = []
        for (const s of this.sentMessages) {
            const found = this.messagesList.find( message => message.id === s.messageId && message.userId === parseInt(userId, 10))
            if (found != null) 
            sent.push(found)
        }
        return sent;
    }

    getMessage(id){
        return this.messagesList.find( message => message.id === parseInt(id, 10))
    }

     deleteMessage(id){
        let deleted 
        for (const index in this.messagesList) {
            if (this.messagesList[index].id === parseInt(id, 10) ) {
                deleted = this.messagesList.splice(index, 1)
            }
        }
        if (deleted) {
            return true
        }else{
            return false
        }
    }

    async createMessage(data){
        let id 
        if(this.messagesList.length != 0){
            id = this.messagesList[this.messagesList.length-1].id+1
        }else{
            id = 1
        }
        const date = new Date()
        const parent = (data.body.parentMessageId) ? data.parentMessageId : 0
        const message = new Message(id, date.toLocaleString('en-us'), data.body.subject, data.body.message, parent, data.userData.userId)
        this.messagesList.push(message)
        this.sentMessages.push(new SentMessage(data.body.to, message.id,"unread", date.toLocaleDateString('en-us')));
        return message;
    }
}

export class SentMessage{
    constructor(receiverId, messageId,status, createdOn) {
        this.receiverId = receiverId,
        this.messageId = messageId,
        this.status = status,
        this.createdOn = createdOn
    }
}