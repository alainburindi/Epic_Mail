import express from 'express';

const userRoutes2 = express.Router()

import UserController from "../../controllers/v2/user";

userRoutes2.post("/signup", UserController.save)
userRoutes2.post("/login", UserController.login)

export default userRoutes2
