const Review=require("../models/review");
const Campground=require("../models/campground");

//creating review
module.exports.createReview=async(req,res)=>{
    const review=await Review.create({
        body:req.body.body,
        rating:req.body.rating,
        author:req.user._id,
        campground:req.params.id

    })
    const campground=await Campground.findById(req.params.id);
    campground.reviews.push(review._id);
    await campground.save();
    console.log(review);
    res.redirect(`/campground/${req.params.id}`);
}

//deleting review
module.exports.deleteReview=async(req,res)=>{
    const review=await Review.findByIdAndDelete(req.params.reviewId);
    if(!review){
         return res.status(404).send("Review not found");
    } 
    const campground=await Campground.findById(req.params.id);
    campground.reviews=campground.reviews.filter(
        reviewId => reviewId.toString() !== req.params.reviewId
    );
    await campground.save();
    res.redirect(`/campground/${req.params.id}`);
}