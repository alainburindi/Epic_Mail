import express from 'express'
import bodyParser from 'body-parser';

const app = express()

import userRoutes from './server/routes/user'
import messageRoutes from './server/routes/messages';
const port = process.env.PORT || 3000

const todo = {
    "notice" : "this is the V1 api so make sure to put /api/v1/ before any route. eg: api/v1/auth/login",
     "GET/" : {
        "/" : "the current result",
        "messages" : "all received messages",
        "messages/unread" : "all unread messages",
        "messages/sent" : "all sent messages",
        "messages/:id" : "get a specific message",
    },

    "POST/" : {
        "auth/signup" : "register a new user",
        "auth/login" : "login a registered user",
        "messages" : "send a message",
    },
    "DELETE/" : {
        "messages/:id" : "delete a specific message"
    }
 }
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

const v1 = "/api/v1";

app.use(`${v1}/auth`, userRoutes)
app.use(`${v1}/messages`, messageRoutes)


app.get('/',(req, res, next) => {
    res.status(200).json({
        status : 200,
        message : "welcome to the EpicMail Api, below is how to use it",
        todo
    })
})
app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error : {
            status : error.status,
            message : error.message
        }
    })
})


app.listen(port)

module.exports = app;

