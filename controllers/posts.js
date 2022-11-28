const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

const Comment = require("../models/BookmarkAttraction")

const fetch = require('node-fetch')


// We are exporting an object and all these are async methods.
module.exports = {

  // When someone goes to the add a new attraction just render the addAttraction.ejs page
  getAttraction: (req, res) => {
    res.render("addAttraction.ejs");
  },

  // When someone goes to search for an attraction, render the searchAttraction.ejs page
  getSearchAttraction: (req, res) => {
    res.render("searchAttraction.ejs")
  },


  // Render the profile page. Go to the database and see if user has any bookmarked attractions. If so, send it to the profile.ejs to render
  getProfile: async (req, res) => {
    try {
      const posts = await Comment.find({ user: req.user.id }); // user: req.user.id will only show the attractions that the user has saved


      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // When user is on the profile page, their bookmarked attractions will be displayed. They have the option to click on an individual attraction
  getPost: async (req, res) => {
    try {
      // Post is the schema for a gernal post
      const post = await Comment.findById(req.params.id); // .params.id getting the query paramater from the url


      res.render("post.ejs", { post: post, user: req.user}); //Once a post that machtes this id is found. Send it to the post.ejs. Also send the comment array

    } catch (err) {
      console.log(err);
    }
  },

  // Users know their cities the best. They can create an attraction. Whoever enteres a matching zipcode will get attractions added by users
  createPost: async (req, res) => {

    var longitude;
    var latitude;

    try {
      

      let obj;

      // In order to have a map display the location of an attraction we need the longitude and latitude. This api lets us enter an address and gives us back information like longitude and latitude
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${req.body.address}%20${req.body.zipcode}&format=json&apiKey=1b62ec9563b9425db6840fa43b228361`);
      obj = await response.json();

      // Save coordinates received from api call so we can add it to our document which will be saved in our database
      longitude = obj.results[0].lon
      latitude = obj.results[0].lat
      

      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Use the Post schema to create a document and save it to mongoDB
      await Post.create({

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
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },

  //When someone completes an attraction they will get the chance to review that attraction
  reviewAttraction: async (req,res) => {

    console.log(req.body, "hello")
    try {
      await Comment.findOneAndUpdate( // Go into the database, find an attraction that matches this ID and update it. 
        { _id: req.params.id },
        {
          $set: { Review: req.body.review, Star: req.body.star}, // Update the empty Review string in the DB to what the users review is. And also update the star field in mongoDB
        }
      );
      res.redirect(`/post/${req.params.id}`); // Redirect back to the same post
    } catch (err) {
      console.log(err);
    }
  },

  // User has the ability to mark an attraction as complete by clicking the check mark
  completeAttraction: async (req, res) => {
    try {
      await Comment.findOneAndUpdate( // Go into the database, find an attraction that matches this ID and update it. 
        { _id: req.params.id },
        {
          $set: { Complete: "true" }, // Update from false to true
        }
      );
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {

    console.log("Here")

    try {
      // Find post by id

      let post = await Comment.findById({ _id: req.params.id });
      console.log(post)

      // Delete image from cloudinary. Not all attractions will have a cloudinary id. Those bookmarked from travel-advisor dont. 
      let cloud = await cloudinary

      // if the attraction in mongoDB contains a cloudinary ID it means a user updoad the attraction. So remove the img from cloudinary
      if(cloud) {
        cloud.uploader.destroy(post.cloudinaryId); // This deletes it from cloudinary becuase we no longer need it
      }
      

      // Delete post from db
      await Comment.remove({ _id: req.params.id });
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },


};