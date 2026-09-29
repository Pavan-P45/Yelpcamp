const express=require("express");
const catchAsync = require("../utils/catchAsync");
const { isloggedin, validateCampground,isAuthorize } = require("../middleware");
const {showCampground,listCampground,createCampground,newCampground,updateCampground,modifyCampground,deleteCampground}=require("../controllers/campgrounds");
const multer=require("multer");
const {storage}=require("../cloudinary");
const upload=multer({storage});
const router=express.Router();

//get all campground
router.get("/",catchAsync(listCampground));

//get route of new campground
router.get("/new",newCampground);

//get the specific campground
router.get("/:id",catchAsync(showCampground));

//creating new campground
router.post("/",isloggedin,upload.array("image"),validateCampground,catchAsync(createCampground));


//get the edit file through ejs
router.get("/:id/edit",isloggedin,isAuthorize,catchAsync(modifyCampground));
  
//update the campground
router.put("/:id",isloggedin,isAuthorize,upload.array("image"),validateCampground,catchAsync(updateCampground));

//Delete the campground
router.delete("/:id",isloggedin,isAuthorize,catchAsync(deleteCampground));

module.exports=router;