import Message from '../models/message';
import auth from '../middleware/check-auth'
import { userController } from '../routes/user';

export default class MessageController {
    constructor() {
        this.messagesList = []
        this.sentMessages = []
        // this.inboxMessages = []
    }

    async addMessage(message){
        this.messagesList.push(message)
    }

    getMessages(){
        return this.messagesList;
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

// export class InboxMessage{
//     constructor(receverId, messageId, createdOn) {
//         this.receverId = receverId,
//         this.messageId = messageId,
//         this.createdOn = createdOn
//     }
// }

export class SentMessage{
    constructor(receiverId, messageId,status, createdOn) {
        this.receiverId = receiverId,
        this.messageId = messageId,
        this.status = status,
        this.createdOn = createdOn
    }
}