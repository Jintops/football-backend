const mongoose=require('mongoose');
const validator=require('validator')

const userSchema=new mongoose.Schema({
 firstName:{
    type:String,
    required:true,
    trim: true,
    minLength: [2, "First name must be at least 2 characters long"],
    maxLength: [30, "First name must be at most 30 characters long"]

 },
 lastName:{
    type:String
 },
 emailId:{
    type:String,
    required:true,
    unique:true,
    validate(value){
      if(!validator.isEmail(value)){
      throw new Error('email is not validd....' + value)
      }
    }
 },
 password:{
    type:String,
    required:true,
    validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error('Please enter a strong password')
        }
    }
 },
 number:{
    type:Number,
 },
 role:{
  type:String,
  default:"user"
 },
 gender:{
    type:String,
    enum: {
      values: ['male', 'female','others'],
      message: '{VALUE} is not supported'
    }
 },
 photoUrl:{
    type:String
 }
},{timestamps:true})

module.exports=mongoose.model('User',userSchema)