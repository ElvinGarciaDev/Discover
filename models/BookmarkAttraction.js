const mongoose = require("mongoose");

const AttractionSchema = new mongoose.Schema({
  Attraction: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },

  image: {
    type: String,  // We will get an image url from the Travel-adviser api
    require: true,
  },

  Description: {
    type: String,
    required: true,
  },
  Complete: {
    type: String,
    required: true,
    default: 'false'
  },
  Review: { // We'll use this for reviewing attractions once it's marked as complete
    type: String,
    default: ''
  },
  Star: { // We'll use this for giving attractions a start raiting once it's marked as complete
    type: String,
    default: "0"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // This is how we tie an attraction to a specific user
    ref: "User",
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

module.exports = mongoose.model("BookmarkedAttractions", AttractionSchema, "BookmarkedAttractions"); // "Post" is the collection name. It takes POST and makes it plural. You can also add a third parameter and call the database whatever you want