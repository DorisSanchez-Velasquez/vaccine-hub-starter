const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const {BadRequestError, NotFoundError} = require('./utils/errors')
const {PORT} = require('./config')
const authRoutes = require('./routes/auth')

//APP USES - Cross Origin Sharing
app.use(cors())
//APP USE - Parse incoming request bodies
app.use(express.json())
//APP USE - Log request info
app.use(morgan('tiny'))
app.use('/auth', authRoutes)


//ERROR HANDLING APP USES
app.use((req,res,next) => {
    return next(new NotFoundError())
})

app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message
    return res.status((status)).json({
        error: {message, status}
    })
})


//PORT RUNNERS
// const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log('Server running http://localhost:' + PORT)
})


