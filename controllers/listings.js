const Listing = require("../models/listing");

// maptilersdk.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
                path:"author",
            },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for doesnot exist.");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req, res, next) => {
    // const result = await maptilerClient.geocoding.forward('New Delhi');
    // console.log(result);
    // res.send("done");
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesnot exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    // console.log(originalImageUrl);
    originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    }
    await listing.save();

    req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};

module.exports.renderFilterPage = async (req, res) => {
        let { filterId } = req.params;
        // console.log('Received filterId:', filterId);
        const allListings = await Listing.find({ category: filterId });
        //console.log(allListings);
        res.render("listings/index.ejs", { allListings });
};

module.exports.renderSearchPage = async (req, res) => {
    let userInput  = req.query.search;
    userInput = userInput.trim().replace(/\s+/g, ' ').toLowerCase();  // Normalize spaces and case
    const searchRegex = userInput.split(' ').join('\\s+'); // Handle multiple spaces
        // Query the normalized location field in the database
        const allListings = await Listing.find({ 
            location: { 
                $regex: new RegExp(`^${searchRegex}$`, 'i')  // Case-insensitive, match with multiple spaces
            }
        });
        // console.log(allListings);  // Log the matched listings
        res.render("listings/index.ejs", { allListings });  // Render the results in the listings page
    };