import express from 'express';

import MessageController from '../../controllers/v2/message'

const messagesRoutes2 = express.Router()

messagesRoutes2.get("/", MessageController.received)
messagesRoutes2.get("/unread", MessageController.unread)
messagesRoutes2.get("/sent", MessageController.sent)
messagesRoutes2.get("/:id", MessageController.find)
messagesRoutes2.post("/", MessageController.create)
messagesRoutes2.delete("/:id", MessageController.delete)

messagesRoutes2.get("/drafts/all", MessageController.getDrafts)
messagesRoutes2.get("/drafts/get/:id", MessageController.getSpecifcDraft)
messagesRoutes2.post("/drafts/save", MessageController.saveDraft)
messagesRoutes2.delete("/drafts/delete/:id", MessageController.delSpecifcDraft)

export default messagesRoutes2
