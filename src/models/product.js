const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    image:{
        type:String
    },
     price:{
        type:Number
    }, 
    title:{
        type:String
    },
     description:{
        type:String
    }, 
    salePrice:{
        type:Number
    },
     brand:{
        type:String
    },
     category:{
        type:String
    },
    totalStock:{
        type:Number
    },
},{timestamps:true})

module.exports=mongoose.model("Product",productSchema);