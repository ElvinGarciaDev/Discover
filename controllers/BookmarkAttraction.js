// When a request of /searchActivity/bookmarkAttraction comes in, the user is searching for attractions

const bookmarkModel = require("../models/BookmarkAttraction") // Bring in the comments model
const localUploadModel = require("../models/localUpload")

// We are exporting an object and all these are async methods.
module.exports = {

    // When someone goes to search for an attraction, render the searchAttraction.ejs page
    getSearchAttraction: (req, res) => {
      res.render("searchAttraction.ejs")
    },

  // Go to the database and get any attractions created by users who match a zipcode the current user entred. 
  getAttractions: async (req, res) => {

    // Go to the database and grab any attractions that users have created with a matching zipcode
    try {
      const attraction = await localUploadModel.find({ Zipcode: req.params.zipcode });
      
      // Respond back to the browser
      res.json(attraction)

    } catch (err) {
      console.log(err);
    }
    
  },

  // If the user selects to bookmark An attraction, save it to the database
  bookmarkAttraction: async (req, res) => {
    try {


      // Use the BookmarkAttraction schema to create a document and save it to mongoDB
      await bookmarkModel.create({

        // Get the data that came from the fetch and use it to create a document in MongoDB 
        Attraction: req.body.Attraction,
        Address: req.body.Address,

        image: req.body.Image,
        Description: req.body.Description,

        Longitude: req.body.Longitude,
        Latitude: req.body.Latitude,

        user: req.user.id, // Make sure a bookmarked attraction document in MongoDB has the userID who saved it. This allows us to pinpoint a specific to a specific user
      });
      // Respond back to the browser
      res.status(200).send(JSON.stringify({"Saved": req.body.Attraction}))
    } catch (err) { 
      console.log(err);
    }
  },

};