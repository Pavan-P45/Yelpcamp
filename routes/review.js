const express=require("express");
const {validateReview,isloggedin,isReviewAuthor}=require("../middleware");
const catchAsync = require("../utils/catchAsync");
const {createReview,deleteReview}=require("../controllers/reviews");
const router=express.Router();

//creating review
router.post("/:id/reviews",validateReview,catchAsync(createReview));

//deleting review
router.delete("/:id/reviews/:reviewId",isloggedin,isReviewAuthor,catchAsync(deleteReview));
module.exports=router;