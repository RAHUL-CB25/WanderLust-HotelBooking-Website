// const express = require("express");
// const router = express.Router({mergeParams: true});
// const wrapAsync = require("../utils/wrapAsync.js");
// // const ExpressError = require("../utils/ExpressError.js");
// // const { reviewSchema } = require('../schema.js');
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
// const { validateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");


//  //reviews route
//     //post review route
//     router.post("/",isLoggedIn,isReviewAuthor,
//         validateReview, wrapAsync(async(req,res)=>{
            
//       let listing = await Listing.findById(req.params.id);
//      let newReview = new Review(req.body.review);
//      newReview.author = req.user._id;
//      console.log(newReview);

//      listing.reviews.push(newReview);
   
//      await newReview.save();
//      await listing.save();
//      console.log("new review saved");
//      // res.send(" new review saved");
//      req.flash("success"," New Review added!");
//      res.redirect(`/listings/${listing._id}`);
//    }))

//    //delte reviews route
//     router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
//      let {id,reviewId}= req.params;
//      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//      await Review.findByIdAndDelete(reviewId);
//      req.flash("success"," Review  Deleted!");
//      res.redirect(`/listings/${id}`)
//     }));

//    module.exports= router;

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController =require("../controllers/review.js");

// POST: Add a review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE: Delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
