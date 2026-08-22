const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find();
  }

  res.render("./listings/index.ejs", { allListings, category });
};

module.exports.renderListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist anymore");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: req.file.path, filename: req.file.filename };
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  let originalImageUrl= listing.image.url;
originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing , originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }

  let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    updatedListing.image = { url: req.file.path, filename: req.file.filename };
    await updatedListing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};
// controller
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing deleted ");
  res.redirect("/listings");
};
