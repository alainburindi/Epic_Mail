import express from 'express'
import bodyParser from 'body-parser';

const app = express()

import userRoutes from './routes/user'
import messageRoutes from './routes/messages';
const port = process.env.PORT || 4000

const todo = [
    { id: 1, description: 'Clean the house', createdOn: '08/02/2019' },
    { id: 2, description: 'Wash this dishes', createdOn: '08/03/2019' },
    { id: 3, description: 'Complete my Assignment', createdOn: '08/04/2019' },
    { id: 4, description: 'Write some code', createdOn: '08/05/2019' }
  ]
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use('/auth', userRoutes)
app.use('/messages', messageRoutes)


app.use('/',(req, res, next) => {
    res.send({
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

