const express=require('express');
var cookieParser = require('cookie-parser')
const userRouter = require('./routes/auth');
const connectDB=require('./config/database')

const app=express();
const PORT=7777


app.use(express.json()); 
app.use(cookieParser())

app.use("/",userRouter);



connectDB().then(()=>{
    console.log("Database connected successfully")
app.listen(PORT,()=>{
    console.log("app successfully listening")
})
}).catch((err)=>{
    console.error("database connection failed")
})



