const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const User=require("./models/user");
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError");
const campgroundRouter=require("./routes/campground");
const reviewRouter=require("./routes/review");
const {router:userRouter,isLoggedIn}=require("./routes/user");
const session=require("express-session");
const {MongoStore}=require("connect-mongo");
const flash=require("connect-flash");
const helmet=require("helmet");
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
require("dotenv").config();


const app=express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({
        contentSecurityPolicy: false
}));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            const result = await User.authenticate()(email, password);
            if (!result || !result.user) {
                return done(null, false);
            }
            return done(null, result.user);
        } catch (err) {
            return done(err);
        }
    }
));
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});
mongoose.connect(process.env.MONGODB_URL)
.then(result=>{
    console.log("mongodb connected");
})
.catch(err=>{
    console.log("connection failed",err);
})


app.set("view engine","ejs");
app.set('views',path.join(__dirname,'views'));
app.get("/",(req,res)=>{
     res.render("home");
});

app.use("/campground",isLoggedIn,campgroundRouter);
app.use("/campground",isLoggedIn,reviewRouter);
app.use("/user",userRouter);

app.use((err, req, res, next) => {
    console.log(err);
    if(err.name==="CastError"){
      err= new ExpressError("Invalid Campground ID",400);
    }
    const statusCode=err.statusCode || 500;
    res.status(statusCode).send(err.message);
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("server running on port 3000");
})