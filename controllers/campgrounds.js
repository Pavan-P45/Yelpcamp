const Campground=require("../models/campground");
const {cloudinary}=require("../cloudinary");

//specific campground controller
module.exports.showCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate('author').populate('reviews');
    if(!campground){
        return res.status(404).send("campground not exists");
    }
    res.render("campgrounds/show",{campground});
};
//list of campground controller
module.exports.listCampground=async(req,res)=>{
    const campgrounds=await Campground.find().populate('reviews');
    for (let campground of campgrounds) {
    let total = 0;
      for (let review of campground.reviews){
          total+=review.rating;
        }
    let averageRating=campground.reviews.length  ? total / campground.reviews.length : 0;
    campground.averageRating=averageRating;
    }
    res.render("campgrounds/index",{campgrounds});
}
//creation of campground controller
module.exports.createCampground=async(req,res)=>{
    const params = new URLSearchParams({
    q: req.body.location,
    format: "json",
    limit: "1"
   });
    const url = `https://nominatim.openstreetmap.org/search?${params}`;
    const response = await fetch(url,{
        headers:{
        "User-Agent":"Yelpcamp/1.0"
        }
    });
    const data = await response.json();
    if (data.length === 0) {
    return res.status(400).send("Location not found");
    }
    console.log(data);
    const latitude=Number(data[0].lat);
    const longitude=Number(data[0].lon);
    const campground=await Campground.create({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        location:req.body.location,
        author:req.user._id,
        geometry:{
            type:"Point",
            coordinates:[longitude,latitude]
        }
    });
   campground.images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    await campground.save();
    req.flash("success","Campground Created Successfully");
    res.redirect("/campground");
}
//form of new campground controller
module.exports.newCampground=(req,res)=>{
    res.render("campgrounds/new")
};
//update campground controller
module.exports.updateCampground=async(req,res)=>{
    const params = new URLSearchParams({
    q: req.body.location,
    format: "json",
    limit: "1"
   });
    const url = `https://nominatim.openstreetmap.org/search?${params}`;
    const response = await fetch(url,{
        headers:{
        "User-Agent":"Yelpcamp/1.0"
        }
    });
    const data = await response.json();
    if (data.length === 0) {
    return res.status(400).send("Location not found");
    }
    console.log(data);
    const latitude=Number(data[0].lat);
    const longitude=Number(data[0].lon);
    const campground=await Campground.findByIdAndUpdate(req.params.id,{...req.body,
        geometry:{
        type:"Point",
        coordinates:[longitude,latitude]}
    },
    {runValidators:true,returnDocument:"after"});
    if(!campground){
        return res.status(404).send("campground not exists");
    }
        const images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
    const deleteImages = Array.isArray(req.body.deleteImages)
        ? req.body.deleteImages
        : [req.body.deleteImages];
    for (let filename of deleteImages) {
        const result = await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
        $pull: {
            images: {
                filename: {
                    $in: deleteImages
                }
            }
        }
    });
}
    
    res.redirect("/campground");
}
//form of update campground controller
module.exports.modifyCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground){
       return res.status(404).send("campground not exists"); 
    }
    res.render("campgrounds/edit",{campground});
}
//delete of campground controller
module.exports.deleteCampground=async(req,res)=>{
    const campground=await Campground.findByIdAndDelete(req.params.id);
    if(!campground){
        return res.status(404).send("campground not exists");
    }
    res.redirect("/campground");
}