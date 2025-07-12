const express=require('express');
const userRouter = require('./routes.js/user');
const app=express();

const connectDB=require('./config/database')
const PORT=7777


app.use(express.json()); 

app.use("/",userRouter);

connectDB().then(()=>{
    console.log("Database connected successfully")
app.listen(PORT,()=>{
    console.log("app successfully listening")
})
}).catch((err)=>{
    console.error("database connection failed")
})



