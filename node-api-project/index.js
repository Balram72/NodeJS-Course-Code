const express = require('express');
const app = express();
const mongoose = require('mongoose');
const studentRoutes = require('./routes/students.routes')
const userRoutes = require('./routes/users.routes')
const auth = require('./middleware/auth')
const connectDB = require('./config/database')
const { MulterError } = require('multer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');   
const cors = require('cors')
const path = require('path');


connectDB();

const PORT = process.env.PORT;

const limiter = rateLimit({
    // windowMs: 15 * 60 * 1000, // 15 minutes
    windowMs: 1000 * 60,
    max: 5, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later...."
})


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use(cors());

// app.use(helmet());

app.use(limiter);

app.use('/api/users',userRoutes)
app.use('/api/students',auth,studentRoutes)

app.use((error,req,res,next)=>{
    if(error instanceof MulterError){
        return res.status(400).send(`Image error : ${error.msg} : ${error.code}`)
    }else if(error){
        return res.status(500).send(`Something went wrong : ${error.msg}`)
    }
    next();
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
