import Message from '../models/message';
import auth from '../middleware/check-auth'

export default class MessageController {
    constructor() {
        this.messagesList = []
        this.sentMessages = []
        this.inboxMessages = []
        this.initMessages()
    }

    async addMessage(message){
        this.messagesList.push(message)
    }

    getMessages(){
        return this.messagesList;
    }

    initMessages(){
        const date = new Date()
        const message = new Message(1,date.toLocaleString('en-us'), "greetings", "hey! how are you?", 0, "unread")
        const message2 = new Message(2,date.toLocaleString('en-us'), "re-greetings", "hey! i'm fine, and you?", 1, "sent")
        this.inboxMessages.push(
            new InboxMessage(auth.userId, message.id, message.createdOn)
        )
        this.sentMessages.push(
            new SentMessage(auth.userId, message2.id, message.createdOn)
        )
        this.messagesList.push(message)
        this.messagesList.push(message2)
    }

    getReceivedEmail(){
        let received = []
        for (const inbox of this.inboxMessages) {
            received.push(this.messagesList.find( message => message.id === inbox.messageId
            ))
        }
        return received;
    }

    getUnreadEmail(){
        let unread = []
        for (const inbox of this.inboxMessages) {
            unread.push(this.messagesList.find( message => message.id === inbox.messageId && message.status == "unread"))
        }
        unread.length > 1 ? unread.length = unread.length-1 : unread
        return unread;
    }

    getSentEmail(){
        let sent = []
        for (const s of this.sentMessages) {
            sent.push(this.messagesList.find( message => message.id === s.messageId
            ))
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
        // for (const index in this.messagesList) {
        //     if (this.messagesList[index].id === parseInt(id, 10) ) {
        //         messagesList.splice(index, 1)
        //     }
        // }
    }

    async createMessage(data){
        const id = this.messagesList[this.messagesList.length-1].id+1
        const date = new Date()
        const parent = (data.parentMessageId) ? data.parentMessageId : 0
        const message = new Message(id, date.toLocaleDateString('en-us'), data.subject, data.message, parent, 'sent')
        this.messagesList.push(message)
        this.sentMessages.push(new SentMessage(auth.userId, message.id, date.toLocaleDateString('en-us')));
        return message;
    }
}

export class InboxMessage{
    constructor(receverId, messageId, createdOn) {
        this.receverId = receverId,
        this.messageId = messageId,
        this.createdOn = createdOn
    }
}

export class SentMessage{
    constructor(senderId, messageId, createdOn) {
        this.senderId = senderId,
        this.messageId = messageId,
        this.createdOn = createdOn
    }
}