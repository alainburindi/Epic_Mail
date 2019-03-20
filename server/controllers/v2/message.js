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
        const userFetchquery = "SELECT * FROM Users WHERE email = $1";
        const values = [to]
        db(userFetchquery, values, (err, users) => {
            if(err)
                return next(err)
            if(users.rowCount != 1)
                return res.status(404).json({
                    status : 404,
                    error : `${req.body.to} not found, make sure you typed a registered user`, 
                })
            const {id, email} = users.rows[0] 
            const createMessageQuery = "INSERT INTO Messages (subject, message, status, parentMessageId, userId, receiverId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
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
            db(createMessageQuery, values, (err, result) => {
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

    static received(req, res, next){
        const {userId} = req.userData
        const selectReceivedEmails = "SELECT m.id, m.subject, m.message, m.status, m.parentmessageid, m.created_at, u.email as from FROM Messages as m INNER JOIN Users as u ON m.userid = u.id WHERE receiverid = $1"
        const values = [userId]
        db(selectReceivedEmails, values, (err, result) => {
            if (err)
            return next(err)
            if(result.rowCount > 0){
                res.status(200).json({
                    data : [result.rows]
                })
            }else{
                res.status(200).json({
                    status : 200,
                    data : "no message for you"
                })
            }
        })
    }

    static unread(req, res, next){
        const {userId} = req.userData
        const selectUnreadEmails = "SELECT m.id, m.subject, m.message, m.status, m.parentmessageid, m.created_at, u.email as from FROM Messages as m INNER JOIN Users as u ON m.userid = u.id WHERE receiverid = $1 AND m.status = $2"
        const values = [userId, 'unread']
        db(selectUnreadEmails, values, (err, result) => {
            if (err)
            return next(err)
            if(result.rowCount > 0){
                res.status(200).json({
                    data : [result.rows]
                })
            }else{
                res.status(200).json({
                    status : 200,
                    data : "no message for you"
                })
            }
        })
    }

    static sent(req, res, next){
        const {userId} = req.userData
        const selectSentMessages = "SELECT m.id, m.subject, m.message, m.status, m.parentmessageid, m.created_at, u.email as to FROM Messages as m INNER JOIN Users as u ON m.receiverid = u.id WHERE userid = $1"
        const values = [userId]
        db(selectSentMessages, values, (err, result) => {
            if (err)
            return next(err)
            if(result.rowCount > 0){
                let messages = []
                for (const message of result.rows) {
                    message.status = "sent"
                    messages.push(message)
                }
                res.status(200).json({
                    data : [messages]
                })
            }else{
                res.status(200).json({
                    status : 200,
                    data : "no message for you"
                })
            }
        })
    }

    static find(req, res, next){
        const validate = Validator.schemaParamsId(req.params )
        if(validate.error){
            res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const {userId} = req.userData
        const findSpecificMessage = "SELECT m.id, m.subject, m.message, m.status, m.parentmessageid, m.created_at, u.email as to FROM Messages as m INNER JOIN Users as u ON m.receiverid = u.id WHERE userid = $1 AND m.id = $2"
        const values = [userId, req.params.id]
        db(findSpecificMessage, values, (err, result) => {
            if (err)
            return next(err)
            if(result.rowCount == 1){
                result.rows[0].status = "sent";
                res.status(200).json({
                    data : result.rows[0]
                })
            }else{
                const findSpecificMessage = "SELECT m.id, m.subject, m.message, m.status, m.parentmessageid, m.created_at, u.email as from FROM Messages as m INNER JOIN Users as u ON m.userid = u.id WHERE receiverid = $1 AND m.id = $2"
                db(findSpecificMessage, values, (err, result) => {
                    if (err)
                    return next(err)
                    if(result.rowCount == 1){
                        res.status(200).json({
                            data : result.rows[0]
                        })
                    }else{
                        res.status(200).json({
                            status : 200,
                            data : "message not found or access is denied"
                        })
                    }
                })
            }
        })
    }

    static delete(req, res, next){
        const validate = Validator.schemaParamsId(req.params )
        if(validate.error){
            res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const {userId} = req.userData
        const fetchOneMessage = "SELECT * FROM Messages WHERE id = $1 AND userid = $2"
        const values = [req.params.id, userId]
        db(fetchOneMessage, values, (err, result) => {
            if (err)
            return next(err)
            if(result.rowCount == 1){
                const deleteAMessage = "DELETE FROM Messages WHERE id = $1" 
                const values = [req.params.id];
                db(deleteAMessage, values, (err, result) => {
                    if(result.rowCount == 1){
                        res.status(200).json({
                            status : 200,
                            data :  [{ message : "successfuly deleted"}]
                        })
                    }
                })
                
            }else{
                res.status(200).json({
                    status : 200,
                    data : "message not found or access is denied"
                })
            }    
        })
    }

    validationError(res, error) {
        res.status(422).json({
           status : 422 ,
           error : error
       })
    }

    static getDrafts (req, res, next) {
        const {userId} = req.userData
        const findDraftedMessages = "SELECT m.id, m.subject, m.message, m.status, m.parentmessageid, m.created_at, u.email as to FROM Messages as m INNER JOIN Users as u ON m.receiverid = u.id WHERE userid = $1 AND status = $2"
        const values = [userId, 'draft']
        db(findDraftedMessages, values, (err, result) => {
            if (err)
            return next(err)
            if(result.rowCount > 0){
                res.status(200).json({
                    data : [result.rows]
                })
            }else{
                res.status(200).json({
                    status : 200,
                    data : "no message for you"
                })
            }
        })
    }

    static saveDraft(req, res, next) {
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
        //check if email exists
        const fetchTheUser = "SELECT * FROM Users WHERE email = $1";
        const values = [to]
        db(fetchTheUser, values, (err, users) => {
            if(err)
                return next(err)
            if(users.rowCount != 1)
                return res.status(404).json({
                    status : 404,
                    error : `${req.body.to} not found, make sure you typed a registered user`, 
                })
            const {id, email} = users.rows[0] 
            const saveDraft = "INSERT INTO Messages (subject, message, status, parentMessageId, userId, receiverId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
            if (!subject){
                subject = 'no-subject'
            }
            const values = [
                subject,
                message,
                "draft",
                parentMessageId,
                userId,
                id
            ]
            db(saveDraft, values, (err, result) => {
                if(err)
                return next(err)
                if(result.rowCount == 1){
                    delete result.rows[0].userid
                    delete result.rows[0].receiverid
                    result.rows[0].to = email
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

    static delSpecifcDraft(req, res, next) {
        const validate = Validator.schemaParamsId(req.params )
        if(validate.error){
            res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const {userId} = req.userData
        const fetchOneDraftMessage = "SELECT * FROM Messages WHERE id = $1 AND userid = $2"
        const values = [req.params.id, userId]
        db(fetchOneDraftMessage, values, (err, result) => {
            if (err)
                return next(err)
            if(result.rowCount == 1){
                const delOneDraftMessage = "DELETE FROM Messages WHERE id = $1" 
                const values = [req.params.id];
                db(delOneDraftMessage, values, (err, result) => {
                    if(result.rowCount == 1){
                        res.status(200).json({
                            status : 200,
                            data :  { message : "successfuly deleted"}
                        })
                    }
                })
            }else{
                res.status(200).json({
                    status : 200,
                    data : "message not found or access is denied"
                })
            }    
        })
    }

    static getSpecifcDraft(req, res, next) {
        const validate = Validator.schemaParamsId(req.params )
        if(validate.error){
            res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const {userId} = req.userData
        const specificEmailQuery = "SELECT m.id, m.subject, m.message, m.status, m.parentmessageid, m.created_at, u.email as to FROM Messages as m INNER JOIN Users as u ON m.userid = u.id WHERE userid = $1 AND m.id = $2 AND status = $3"
        const values = [userId, req.params.id, 'draft']
        db(specificEmailQuery, values, (err, result) => {
            if (err)
                return next(err)
            if(result.rowCount == 1){
                res.status(200).json({
                    data : result.rows[0]
                })
            }else{
                res.status(200).json({
                    status : 200,
                    data : "message not found or access is denied"
                })
            }
        })
    }
    
    static sendSpecifcDraft(req, res, next) {
        const validate = Validator.schemaParamsId(req.params )
        if(validate.error){
            res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const {userId} = req.userData
        const fetchOneDraftMessage = "SELECT * FROM Messages WHERE id = $1 AND userid = $2 AND status = $3"
        const values = [req.params.id, userId, 'draft']
        db(fetchOneDraftMessage, values, (err, result) => {
            if (err)
                return next(err)
            if(result.rowCount == 1){
                const setMessageAsSent = "UPDATE Messages SET status = $1 WHERE id = $2"; 
                const values = ['unread', req.params.id];
                db(setMessageAsSent, values, (err, result) => {
                    if(result.rowCount == 1){
                        // result.rows[0].status = "sent"
                        res.status(200).json({
                            status : 200,
                            message :   ["message sent corrctly"]
                        })
                    }
                })
            }else{
                res.status(200).json({
                    status : 200,
                    data : "message not found or access is denied"
                })
            }    
        })
    }
}
