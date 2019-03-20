import express from 'express';

import MessageController from '../../controllers/v2/message'

const messagesRoutes2 = express.Router()

messagesRoutes2.get("/", MessageController.received)
messagesRoutes2.get("/unread", MessageController.unread)
messagesRoutes2.get("/sent", MessageController.sent)
messagesRoutes2.get("/:id", (req, res) => res.send("not yet done"))
messagesRoutes2.post("/", MessageController.create)
messagesRoutes2.delete("/:id", (req, res) => res.send("not yet done"))

export default messagesRoutes2