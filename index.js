const express = require('express')
const userRouter = require('./routes/userRoutes')
const fileUpload = require('express-fileupload')
const path = require('path')
const PORT = 8000

const app = express();

app.use(express.json())
app.use(express.static(path.resolve('static')))
app.use(fileUpload({}))
app.use('/api', userRouter)

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`))