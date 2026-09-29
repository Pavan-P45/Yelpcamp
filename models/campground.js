const mongoose=require("mongoose");

const imageSchema=new mongoose.Schema({
    url:{
        type:String
    },
    filename:{
        type:String
    }
})
imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

imageSchema.set("toJSON", { virtuals: true });
imageSchema.set("toObject", { virtuals: true });

const campGroundSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    location:{
        type:String
    },
    images:[imageSchema],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    geometry:{
        type:{
        type:String,
        enum:["Point"],
        required:true
    },
        coordinates:{
        type:[Number],
        required:true
      }
    }
});
const Campground=mongoose.model("Campground",campGroundSchema);

module.exports=Campground;