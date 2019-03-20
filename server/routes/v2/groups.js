import express from 'express';

import GroupController from '../../controllers/v2/groups'

const groupsRoutes = express.Router()

groupsRoutes.post("/", GroupController.create)
groupsRoutes.get("/", GroupController.getCreated)
groupsRoutes.patch("/:id/name", GroupController.editName)
groupsRoutes.delete("/:id", GroupController.delGroup)
groupsRoutes.post("/:id/users", GroupController.addUser)
groupsRoutes.delete("/:id/users/:id", GroupController.delUser)
groupsRoutes.post("/:id/messages", GroupController.sendMessage)


export default groupsRoutes
