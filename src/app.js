const express=require('express')
const app=express();

app.use("/",(req,res)=>{
    res.send("hoccoccco")
})


app.listen(7777,()=>{
    console.log("app successfully listening")
})




