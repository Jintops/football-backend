const express=require('express')
const app=express();

app.use("/",(req,res)=>{
    res.send("hoccoccco")
})
const PORT=7777

app.listen(PORT,()=>{
    console.log("app successfully listening")
})




