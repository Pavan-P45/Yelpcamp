const mongoose=require("mongoose");
const User = require("./user");


const reviewSchema=mongoose.Schema({
    body:{
        type:String
    },
    rating:{
        type:Number,
        min:0,
        max:5
    },
    campground:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Campground"
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
const Review=mongoose.model("Review",reviewSchema);

module.exports=Review;