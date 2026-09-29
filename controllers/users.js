const User=require("../models/user");

//creating user
module.exports.registerUser=async(req,res)=>{
    const user=new User({
        name:req.body.name,
        email:req.body.email
    });
    const registerUser=await User.register(user,req.body.password);
    console.log(registerUser);
    res.redirect("/user/login");
};

//getting register form
module.exports.registerForm=(req,res)=>{
    res.render("users/register")
};

//getting login form
module.exports.loginForm=(req,res)=>{
    res.render("users/login");
};

//login user 
module.exports.loginUser=(req,res)=>{
     res.redirect("/campground");
}

//logout user
module.exports.logoutUser=(req,res)=>{
    req.logout((err)=>{
    if(err){
       return res.status(401).send("Logout failed");
    }
    res.redirect("/user/login");
   });
};

//get usercampgorund
module.exports.userCampground=async(req,res)=>{
    const user = await User.findOne().populate("campgrounds");
    console.log(user);
    res.json(user);
};