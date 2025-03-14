const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema} = require('../schema.js');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing } = require("../middleware.js");
 
const listingController =require("../controllers/listings.js")
 
const multer=require("multer");
const {storage}=require("../cloudConfig.js");

const upload  =multer({storage})


router.route("/")
.get( wrapAsync(listingController.index))
.post(
   isLoggedIn,
   
   upload.single('listing[image]'),
   validateListing,
    wrapAsync(listingController.createListing)
 );

 //new
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
   isLoggedIn,
   isOwner, 
   upload.single('listing[image]'),
   validateListing,
    wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner , wrapAsync(listingController.destroyListing))


//Edit route
router.get("/:id/edit",isLoggedIn,
   isOwner,
   wrapAsync(listingController.renderEditForm));


 module.exports=router;
// //index route
// router.get("/", wrapAsync(listingController.index));
// //new
// router.get("/new",isLoggedIn,listingController.renderNewForm);
//show route
// router.get("/:id", wrapAsync(listingController.showListing));
  
  
   // create route
//    router.post("/",
//     isLoggedIn,
//     validateListing,
//      wrapAsync(listingController.createListing)
//   );
   
      //  //Edit route
      //  router.get("/:id/edit",isLoggedIn,
      //   isOwner,
      //   wrapAsync(listingController.renderEditForm));

       //update route
      //  router.put("/:id",
      //   isLoggedIn,
      //   isOwner, 
      //   validateListing,
      //    wrapAsync(listingController.updateListing));

      //Delete route by mam
      // app.delete("/listings/:id" ,  wrapAsync(async(req,res)=>{
      //   let {id}=req.params;
      //   let deletedListing = await Listing.findByIdAndDelete(id);
      //   console.log(deletedListing);
      //   res.redirect("/listings"); //redirect in home page
      // }));
 
       //by chat gpt
      //  router.delete("/:id",isLoggedIn, isOwner , wrapAsync(listingController.destroyListing));

   //  module.exports=router;