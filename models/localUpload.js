const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  Attraction: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },

  image: {
    type: String,  // we dont want to store media in our databse. Cloaudanery stores the image on their server and give us a url
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },

  Description: {
    type: String,
    required: true,
  },
  Zipcode: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // This is how we tie a post to a specific user
    ref: "User",
  },
  userName: {
    type: String, // This is how we tie a post to a specific user
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Longitude: {
    type: Number,
    required: true,
  },
  Latitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("localPost", PostSchema, "localPost"); // "Post" is the collection name. It takes POST and makes it plural. You can also add a third parameter and call the database whatever you want
