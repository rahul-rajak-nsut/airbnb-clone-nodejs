const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type: String,
        required: true,

    } ,
    description : String,
    image:{
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
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
    },


    } ,
    price : Number,
    location : String,
    country : String,

});
const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;