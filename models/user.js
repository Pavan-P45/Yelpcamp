const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
})
userSchema.plugin(passportLocalMongoose,{
    usernameField:"email"
});
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
userSchema.virtual("campgrounds", {
    ref: "Campground",
    localField: "_id",
    foreignField: "author"
});
const User=mongoose.model("User",userSchema);

module.exports=User;