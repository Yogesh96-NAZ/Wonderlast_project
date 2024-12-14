const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } =require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//review post route
router.post("/",isLoggedIn, validateReview,
     wrapAsync(reviewController.createReview));

//delete route
// router.delete("/:reviewId",
//     wrapAsync(async (req, res) => {
//    let { id, reviewId } = req.params;

//    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//    await Review.findByIdAndDelete(reviewId);
//    req.flash("success", " Review Deleted");
//    res.redirect(`/listings/${id}`);
// }));
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor, 
    wrapAsync(reviewController.destroyReview));


module.exports = router;