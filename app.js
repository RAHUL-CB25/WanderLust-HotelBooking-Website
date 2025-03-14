if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

// console.log(process.env.SECRET);


const express= require("express");
const app = express();
const  mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const  session = require("express-session");

const MongoStore = require('connect-mongo');  //connect session for mongo
const flash =require("connect-flash");

const  passport = require("passport");
const LocalStrategy= require("passport-local");
const User = require("./models/user.js");

//personal routes for listings and posts
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"; // FOR CONNECTING TO MONGO ATLASCOMMENT IT

const dbUrl =process.env.ATLASTDB_URL // fetch from env file


main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})


async function main(){
     await mongoose.connect(dbUrl);  //previous we were passing MONGO_URL on localhost  change it to dbURL now its not connecting to localdatabase ,it will contect from Atlas db 
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));



//by mam 
// const sessionOptions ={
//   secret:"mysupersecretcode",
//   resave:false,
//   saveUninitialized:true,
//   Cookie:{
//     expires:Date.now() + 7 *24*60*60*1000,
//     maxAge: 7*24*60*60*1000,
//   },
// };
   
// app.use(session(sessionOptions));


//for creating  mongo store 
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
     secret:process.env.SECRET,
  },
  touchAfter:24*3600,
 });

 store.on("error",(err)=>{
    console.log("error in Mongo  session Store",err)
 });


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { // Use lowercase 'cookie'
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Wrap in 'new Date()'
      maxAge: 7 * 24 * 60 * 60 * 1000, //  login  Valid for 7 days
      httpOnly:true,
    },
  };
  
// app.get("/",(req,res)=>{
//    res.send("Hi I am root ");
// })


  app.use(session(sessionOptions));
  app.use(flash());
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // use static authenticate method of model in LocalStrategy
  passport.use(new LocalStrategy(User.authenticate()));

   // use static serialize and deserialize of model for passport session support
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


// app.use((req,res,next)=>{
//     console.log("User:", req.user); // Debugging
//     res.locals.success = req.flash("success") || ""  // Ensure `success` is always an array
//     res.locals.error = req.flash("error") || "";
//     res.locals.currUser = req.user || null;  // Prevent `currUser` from being undefined
//     next()
// })

app.use((req, res, next) => {
  console.log("User:", req.user); // Debugging
  console.log("Flash Messages - Success:", req.flash("success")); // Debugging
  console.log("Flash Messages - Error:", req.flash("error")); // Debugging

  res.locals.success = req.flash("success") || []; // Ensure `success` is always an array
  res.locals.error = req.flash("error") || [];
  res.locals.currUser = req.user || null; 

  next();
});

   

//  app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:'abc@gmail.com',
//     username:'sigma-student'

//   });
//    let registeredUser =await  User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
//  })


  
   app.use("/listings",listingRouter);
   app.use("/listings/:id/reviews",reviewRouter); 
   app.use("/",userRouter);

    //error handling for any other route
    app.all("*",(req,res,next)=>{
     next(new ExpressError(404,"PAGE NOT FOUND")) ;
    })
     //define middleware
    //  app.use((err,req,res,next)=>{
    //   res.send("Something went Wrong!")
    //  })
      
    app.use((err,req,res,next)=>{
      let{statusCode=500,message="Something went Wrongck"}=err;
        res.status(statusCode).render("error.ejs",{message});
      // res.status(statusCode).send(message);
     })


 app.listen(8080,()=>{
     console.log("server is listening to port 8080");
 })