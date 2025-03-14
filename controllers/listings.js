const Listing=require("../models/listing");
const Review = require("../models/review");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async(req,res)=>{
    const  allListings = await Listing.find({});
    res.render("listings/index",{allListings});
     }
     
     module,exports.renderNewForm=(req,res)=>{
        // console.log(req.user);
        res.render("listings/new.ejs")
     }

module.exports.showListing = async(req,res)=>{
        let {id}= req.params;
        const listing = await Listing.findById(id)
        .populate({
          path:"reviews", 
          populate:{
            path:"author",
          },
          })
        .populate("owner");
         if(!listing){
          req.flash("error","  Listing you requested  for does not exist!");
           res.redirect("/listings");
         }
         console.log(listing);
        res.render("listings/show",{listing});
       }

module.exports.createListing=async (req,res,next)=>{
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()

        // let {title,description,image,price,country,location}=req.body;
        let url= req.file.path;
        let filename=req.file.filename;
        // console.log(url,"..",filename);
        const newListing =  new Listing(req.body.listing);
        // console.log(req.user);
        newListing.owner = req.user._id;
        newListing.image={url,filename};

        newListing.geometry=response.body.features[0].geometry;

         let savedListing=await newListing.save();
         console.log(savedListing)
        req.flash("success"," New Listing Created!");
        res.redirect("/listings");
        // console.log(newListing);
     
     }


module.exports.renderEditForm=async (req,res)=>{
              
              let {id} =req.params;
              const listing = await Listing.findById(id);
              if(!listing){
               req.flash("error","  Listing you requested  for does not exist!");
                res.redirect("/listings");
              }
                 let  originalImageUrl = listing.image.url;
                 originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250" )
              res.render("listings/edit.ejs",{listing,originalImageUrl});
            }


module.exports.updateListing=async(req,res)=>{
                      let {id}=req.params;
                      let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
                 
                      if( typeof req.file !== "undefined"){
                      let url= req.file.path;
                      let filename=req.file.filename;
                      listing.image={url,filename};
                      await listing.save();
                      }
                      req.flash("success","Listing updated!");
                      res.redirect("/listings");//its working
                    //by mam its nit working|
                    //res.redirect(`/listings${id}`);
                    }

// module.exports.destroyListing=async (req, res) => {
//                         const { id } = req.params;
//                         const listing = await Listing.findByIdAndDelete(id); // Does not trigger middleware
//                         if (listing) {
//                             await Review.deleteMany({ _id: { $in: listing.reviews } });
//                         }
//                         req.flash("success"," Listing Deleted!");
//                         res.redirect("/listings");
//                     }
module.exports.destroyListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the listing to ensure it exists
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }

        // Check if the current user is the owner of the listing
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You do not have permission to delete this listing!");
            return res.redirect(`/listings/${id}`);
        }

        // Delete all reviews associated with this listing
        await Review.deleteMany({ listingId: id });

        // Delete the listing itself
        await Listing.findByIdAndDelete(id);

        req.flash("success", "Listing and its associated reviews have been deleted successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing and reviews:", err);
        req.flash("error", "Something went wrong while deleting the listing.");
        res.redirect("/listings");
    }
};
