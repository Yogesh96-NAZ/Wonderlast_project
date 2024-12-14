const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
};   
 
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Trim the id and reviewId to remove any extra spaces
    id = id.trim();
    reviewId = reviewId.trim();

    // Check if the IDs are valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).send('Invalid ID format');
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted");
    res.redirect(`/listings/${id}`);
};