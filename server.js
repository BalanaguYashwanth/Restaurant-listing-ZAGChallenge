const express = require('express')
const cors = require('cors');
const connectDb = require('./config/dbConnection');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes')
const reviewRoutes = require('./routes/reviewsRoutes')
require("dotenv").config();

connectDb()
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)
app.use('/listing', listingRoutes)
app.use('/reviews', reviewRoutes)

app.use('/',(req,res)=>{
    res.status(200).json({message:'status healthy'})
})

app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
})