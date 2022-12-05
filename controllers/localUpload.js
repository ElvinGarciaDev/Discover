const cloudinary = require("../middleware/cloudinary");
const localUploadModel = require("../models/localUpload");

const Comment = require("../models/BookmarkAttraction")

const fetch = require('node-fetch')


// We are exporting an object and all these are async methods.
module.exports = {

  // When someone goes to the add a new attraction just render the addAttraction.ejs page and also get all the attractions they've created in the database
  getAttraction: async (req, res) => {

    try {

      //go into the database, see if the logged in user has created any attractions for others to visit.
      const local = await localUploadModel.find({user: req.user.id})

      // Render the addAttraction page and all the attractions this user has created. We will also the user to edit any fields for any attractions they created
      res.render("addAttraction.ejs", {user: req.user, local: local });
    } catch (err) {
      console.log(err);
    }
  },

  // When somone wants to update a specific attraction. Go to the database grab that specific attraction and show the updateAttraction.ejs
  updateAttraction: async (req, res) => {
    console.log(req.params.id)

    try {

      const local = await localUploadModel.findById(req.params.id); // .params.id getting the query paramater from the url
      console.log(local)


      res.render("updateAttraction.ejs", { local: local, user: req.user}); //Once a post that machtes this id is found. Send it to the post.ejs. Also send the comment array
      
    } catch (error) {
      console.log(error)
    }
  },

  // When a user wants to update an attraction they've created
  updateLocalAttraction: async (req, res) => {

    // We need to figure out if a user wants to update the location on an attraction they submitted to the database.
    // Let's try to compare the Address property in the MongoDB document vs the req.body.address that's coming in

    try {

      // Bring in the attraction from MongoDB so we can compare it to the form the user submitted
      const local = await localUploadModel.findById(req.params.id)
      
      // If the address or zip code from the MongoDB stored documnet have a different value than the address coming in from the form
      // We need to update the address and GPS coordinates so we can send the correct points to our map
      if(req.body.Address != local.Address || req.body.Zipcode != local.Zipcode) {
        
        // If the address has been changed, we need to get the GPS coordinates of the new location
        // In order to have a map display the location of an attraction we need the longitude and latitude. This api lets us enter an address and gives us back information like longitude and latitude
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${req.body.Address}%20${req.body.Zipcode}&format=json&apiKey=1b62ec9563b9425db6840fa43b228361`);
        let obj = await response.json();

        // Save coordinates received from api call so we can add it to our document which will be saved in our database
        let longitude = obj.results[0].lon
        let latitude = obj.results[0].lat

        // Once we have the coordinates of the new address we can update the document in MongoDB
        await localUploadModel.findOneAndUpdate( // Go into the database, find an attraction that matches this ID and update it. 
          { _id: req.params.id },
          {
            $set: req.body, // Once founded, just update any matching fileds
            Longitude: longitude, // Also update the new Longitude
            Latitude: latitude // Also update the new latitude
          }
        );

      }else { // The user does not need to update the address, so gps coordinates can stay the same.

        await localUploadModel.findOneAndUpdate( // Go into the database, find an attraction that matches this ID and update it. 
          { _id: req.params.id },
          {
              set: req.body // Once founded, just update any matching fileds
          }
        );
      }
      res.redirect(`/addAttraction`);

    } catch (err) {
      console.log(err);
    }
  },


  // Users know their cities the best. They can create an attraction. Whoever enteres a matching zipcode will get attractions added by users
  createPost: async (req, res) => {

    try {
      
      // In order to have a map display the location of an attraction we need the longitude and latitude. This api lets us enter an address and gives us back information like longitude and latitude
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${req.body.address}%20${req.body.zipcode}&format=json&apiKey=1b62ec9563b9425db6840fa43b228361`);
      let obj = await response.json();

      // Save coordinates received from api call so we can add it to our document which will be saved in our database
      let longitude = obj.results[0].lon
      let latitude = obj.results[0].lat
      

      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Use the Post schema to create a document and save it to mongoDB
      await localUploadModel.create({

        Attraction: req.body.title,
        Address: req.body.address,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        Description: req.body.description,
        Zipcode: req.body.zipcode,
        user: req.user.id,
        
        // coordinates received from api call above. We will need the coordinates to display the map on each attraction
        Longitude: longitude,
        Latitude: latitude
      });
      console.log("Post has been added!");
      res.redirect("/addAttraction");
    } catch (err) {
      console.log(err);
    }
  }
};