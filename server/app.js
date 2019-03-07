import express from 'express';

const app = express();


// app.use(bodyParser.urlencoded({extended : true}))
// app.use(bodyParser.json())

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, PATCH')
//         return res.status(200).json({})
//     }
// })
app.use((req, res, next) => {
    res.status(200).json({
        message: "okay"
    })
})

module.exports = app;
