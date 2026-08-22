const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    // default: "https://media.istockphoto.com/id/1731443210/photo/presidential-debates.jpg?s=612x612&w=0&k=20&c=cS4LhlWvzWqxXJysAlDpmXMb3wnBnwoFw0vIlOtj8p4=",
    // type: String,
    // set: (v)=> v==""?  "https://media.istockphoto.com/id/1731443210/photo/presidential-debates.jpg?s=612x612&w=0&k=20&c=cS4LhlWvzWqxXJysAlDpmXMb3wnBnwoFw0vIlOtj8p4=":v,
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      
    
      default:
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1000&auto=format&fit=crop",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1000&auto=format&fit=crop"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
    ],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
//mongoose middleware , jaise he app.js se listing delete hoga , ye midlle ware bhi call hoga , jisse sari revies bhi delete ho jayenga
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
module.exports =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);
