import express from 'express'
import bodyParser from 'body-parser';

const app = express()

import userRoutes from './routes/user'

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use('/auth', userRoutes)


app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error : {
            message : error.message
        }
    })
})
module.exports = app;

