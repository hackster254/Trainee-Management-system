const express = require('express')

const morgan = require('morgan')

const dotenv = require('dotenv')
const {connectDatabase} = require('./config/db')

// import routes
const courseRoutes = require('./routes/course')

const classRoutes = require('./routes/class')

const studentRoutes = require('./routes/student')


const app = express()

app.use(express.json())



dotenv.config({path: './config.env'})

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


// use ROUTES
app.use('/api/course', courseRoutes)
app.use('/api/class', classRoutes)
app.use('/api/student', studentRoutes)

const port = process.env.PORT || 5000


app.listen(port, ()=>console.log(`backeend server running on port: ${port}`))
connectDatabase()