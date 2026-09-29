const { campgroundSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Campground=require("./models/campground");
const Review=require("./models/review");

function isloggedin(req,res,next){
    const user=req.user;
    if(!user){
        return res.status(401).send("User not logged in");
    }
    next();
}

function validateCampground(req,res,next){
    const result=campgroundSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(result.error.message,400);
    }
    next();
}

function validateReview(req,res,next){
    const result=reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(result.error.message,400);
    }
    next();
}
async function isAuthorize(req,res,next){
    const campground=await Campground.findById(req.params.id);
    if(!campground){
        return res.status(404).send("Campground not found");
    }
    if(!campground.author.equals(req.user._id)){
        return res.status(403).send("unauthorize");
    }
    next();
}
async function isReviewAuthor(req,res,next){
    const review=await Review.findById(req.params.reviewId);
    if(!review){
        return res.status(404).send("review not found");
    }
    if(!review.author.equals(req.user._id)){
        return res.status(403).send("unauthorize");
    }
    next();
}
module.exports={isloggedin,validateCampground,validateReview,isAuthorize,isReviewAuthor};