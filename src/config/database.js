const mongoose = require('mongoose');

const connectDB=async ()=>{
    await mongoose.connect("mongodb+srv://jintops2003:GqQGs4SJup6e4EP4@cluster0.qqz2zl0.mongodb.net/")
}

export default connectDB;