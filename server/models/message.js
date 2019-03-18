export default class Message {
    constructor(id, createdOn, subject, message, parentMessageId, userId) {
        this.id = id,
        this.createdOn = createdOn,
        this.subject = subject,
        this.message = message,
        this.parentMessageId = parentMessageId,
        this.userId = userId
    }
}