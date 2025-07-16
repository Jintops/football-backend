const express=require('express');
var cookieParser = require('cookie-parser')
const cors=require('cors');
const connectDB=require('./config/database');
const productRouter = require('./routes/product');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');


const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true

}))
const PORT=7777


app.use(express.json()); 
app.use(cookieParser())

app.use("/",userRouter);
app.use("/",productRouter);
app.use("/",adminRouter)
app.use("/",profileRouter)




connectDB().then(()=>{
    console.log("Database connected successfully")
app.listen(PORT,()=>{
    console.log("app successfully listening")
})
}).catch((err)=>{
    console.error("database connection failed")
})



