const express = require("express");
//const mongoose = require("mongoose");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
//const { listingSchema } =require("../schema.js");
//const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing } =require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn, 
       
       upload.single('listing[image]'),
       validateListing, 
       wrapAsync
       (listingController.createListing));


// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


    
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
     isOwner,
     upload.single('listing[image]'),
     validateListing, 
     wrapAsync(listingController.updateListing))
.delete(isLoggedIn,
        isOwner, 
        wrapAsync(listingController.destroyListing));


//index route
// router.get("/",  wrapAsync(listingController.index)
// );



// show route
// router.get("/:id", 
//     wrapAsync(listingController.showListing)
// );

// app.get("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     id = id.trim(); // Trim the id to remove any leading or trailing whitespace
//     try {
//         const listing = await Listing.findById(id);
//         if (!listing) {
//             return res.status(404).send('Listing not found');
//         }
//         res.render("listings/show.ejs", { listing });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

//create route
// router.post("/",
//     isLoggedIn, validateListing, wrapAsync
//     (listingController.createListing));
   // it can use to joi api for short required    
   // if(!newListing.title){
   //     throw new ExpressError(400, "Title is missing!");
   // }    
   // if(!newListing.description){
   //     throw new ExpressError(400, "Description is missing!");
   // }    
   // if(!newListing.location){
   //     throw new ExpressError(400, "Location is missing!");
   // }    
   // if(!newListing.country){
   //     throw new ExpressError(400, "Country is missing!");
   // }    
       

//edit route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync
    (listingController.renderEditForm));

// update route
// router.put("/:id", 
//     isLoggedIn,isOwner, validateListing, 
//       wrapAsync(listingController.updateListing)
// );

//delete route
// router.delete("/:id", isLoggedIn,isOwner,
//     wrapAsync(listingController.destroyListing));




module.exports = router;
