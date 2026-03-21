const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
//conec
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("conncted to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // taki sara data parse ho ske
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => {
  res.send("hi  i am root");
});

const validateListing=(req, res, next)=>{
  let {error} = listingSchema.validate(req.body);
    
    if(error){
      //we have a lot of error details with each error
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }


}
//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings }); // index.ejs me pass kr rahe hai sare listings
  }),
);

//create route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  }),
);
//create route
app.post(
  "/listings", 
  validateListing,
  wrapAsync(async (req, res, next) => {
    

    const newListing = new Listing(req.body.listing);

    await newListing.save();
    res.redirect("/listings");
  }),
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);
//update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    
    let { id } = req.params;

    const listing = await Listing.findById(id);

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    await listing.save();
    res.redirect(`/listings/${id}`);
  }),
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);
// app.get("/testListing" ,  async (req, res)=>{
//   //creating new document
//   let sampleListing= new Listing({
//     title: "my new villa",
//     description : "by the beeach",
//     price:1200,
//     location: "calanguta , Goa",
//     country : "india"
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("succcesful testing");

// });

//if not mached root
//This middleware runs only if no route matched above it.
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
//industrial way best
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server is listinig to port 8080");
});
