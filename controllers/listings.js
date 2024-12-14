// const Listing = require("../models/listing");
const axios = require('axios');
const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const { query } = require('express');

const mapToken = process.env.MAP_TOKEN;
const maptilerClient = require("@maptiler/client");


module.exports.index =async(req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = (async (req, res) => {
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
        req.flash("error", "Listing You requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
    });



    module.exports.createListing = async (req, res, next) => {
        try {
            // Retrieve the location from the request body
            const locationQuery = req.body.listing.location;
            if (!locationQuery) {
                throw new Error("Location is required to create a listing.");
            }
    
            // Call MapTiler Geocoding API with the dynamic location
            const geocodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(locationQuery)}.json`;
            const geocodingResponse = await axios.get(geocodingUrl, {
                params: {
                    key: mapToken,
                    limit: 1,
                },
            });
    
            const features = geocodingResponse.data.features;
            if (!features || features.length === 0) {
                throw new Error('No results found for the provided location.');
            }
    
            const geoCoordinates = features[0].geometry.coordinates; // [longitude, latitude]
            console.log('Coordinates:', geoCoordinates);
    
            // Save the listing
            let url = req.file.path;
            let filename = req.file.filename;
    
            let result = listingSchema.validate(req.body);
            if (result.error) {
                throw new Error(result.error.message);
            }
    
            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
            newListing.image = { url, filename };
            newListing.geometry = {
                type: 'Point',
                coordinates: geoCoordinates,
            };
    
            await newListing.save();
            req.flash("success", "New listing created");
            res.redirect("/listings");
        } catch (err) {
            console.error(err);
            req.flash("error", err.message);
            res.redirect("/listings/new");
        }
    };
    



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
     req.flash("error", "Listing You requested for does not exist!");
     res.redirect("/listings");
 }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_50");
    res.render("listings/edit.ejs", { listing, originalImageUrl});
    
 };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
 };    
 



 // module.exports.createListing = (async (req, res, next) => {
//     let response = await maptilerClient.forwordmaptiler({
//         query:'Lucknow, India',
//         limit:1,
//     })
//       .send();

//     console.log(response);
//     res.send("done!");

//         let url = req.file.path;
//         let filename = req.file.filename;
        
//         let result = listingSchema.validate(req.body);
//         console.log(result);
//         if(result.error){
//             throw new ExpressError(400, result.error);
//         }
//         const newListing = new Listing(req.body.listing);
//         //console.log(req.user);
//         newListing.owner = req.user._id;
//         newListing.image = {url, filename};
//         await newListing.save();
//         req.flash("success", "new listing created");
//         res.redirect("/listings");  
// });
