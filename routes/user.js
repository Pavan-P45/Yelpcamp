const express=require("express");
const catchAsync=require("../utils/catchAsync");
const router=express.Router();
const passport=require("passport");
const {registerUser,registerForm,loginForm,loginUser,logoutUser,userCampground}=require("../controllers/users");

function isLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return res.status(404).send("user not exist");
    }
    next();
    
};
//creating user
router.post("/register",catchAsync(registerUser));

//getting register form
router.get("/register",registerForm);

//getting login form
router.get("/login",loginForm);

//login user 
router.post("/login",passport.authenticate("local",{failureRedirect:"/user/login"}),loginUser);

//logout user
router.get("/logout",logoutUser);

//get usercampground
router.get("/campgrounds",catchAsync(userCampground));

module.exports={router,isLoggedIn};