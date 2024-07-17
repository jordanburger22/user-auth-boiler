const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const morgan = require('morgan')
const PORT = process.env.PORT || 8000;
const {expressjwt} = require('express-jwt')

// Add .env to gitignore
// Add values to .env

// Middleware Connections
app.use(express.json())
app.use(morgan('dev'))


// DB connection
const connectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to DB')
    } catch (error) {
        console.log(error)
    }
}

connectToDB()

const auth = expressjwt({
    secret: process.env.SECRET,
    algorithms: ['HS256']
})

// Routes

app.use('/api/auth', require('./routes/authRouter'))


// error handler
app.use((err, req, res, next) => {
    console.log(err)
    if(err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    res.send({errMsg: err.message})
})


// Connection
app.listen(PORT, ()=>{
    console.log(`App running in port: ${PORT}'`)
})