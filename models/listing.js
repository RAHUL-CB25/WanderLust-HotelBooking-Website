const mongoose = require("mongoose");
// const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js")



const listingSchema = new Schema({
   title:{ 
    type:String,
    required:true,

     },
   description:String,
  //  image:{ 
  //   type:String,
  //   required:true,
  //   default :
    //     "https://unsplash.com/photos/house-surrounded-with-trees-oSIuIEZZ6v0",
    // set:(v) => v ==='' ? "https://unsplash.com/photos/house-surrounded-with-trees-oSIuIEZZ6v0"
    // : v,

    //  },

    image: { 
      type: new Schema({
          filename: String,
          url: String,
          // "https://unsplash.com/photos/house-surrounded-with-trees-oSIuIEZZ6v0",
          // set:(v) => v ==='' ? "https://unsplash.com/photos/house-surrounded-with-trees-oSIuIEZZ6v0"
          // : v,
      }),
      required: true,
    },
   price:Number,
   location : String,
   country: String,
   reviews: [
    {
      type:Schema.Types.ObjectId,
      ref: "Review",
    }
   ],
   owner:{
           type:Schema.Types.ObjectId,
           ref:"User",
   },
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },

})

// listingSchema.post("findOneAndDelete",async(listing)=>{  
// if(listing){
//       await Review.deleteMany({_id:{ $in:listing.reviews}});
//     }
// })

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
      console.log("Middleware triggered for listing:", listing);
      await Review.deleteMany({ _id: { $in: listing.reviews } });
  } else {
      console.log("No listing found to delete.");
  }
});



const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
