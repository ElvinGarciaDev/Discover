const cloudinary = require("../middleware/cloudinary");

// Bring in the model so we can talk to the database. This holds all the bookmarked attractions
const bookmarkedAttractionModel = require("../models/BookmarkAttraction")

// We are exporting an object and all these are async methods.
module.exports = {


  // Render the profile/pending page. Go to the database and see if user has any bookmarked attractions. If so, send it to the profile.ejs to render
  getProfile: async (req, res) => {
    try {
      const posts = await bookmarkedAttractionModel.find({ user: req.user.id, Complete: "false" }); // user: req.user.id will only show the attractions that the user has saved. On the profile page, we only want to show attractions that have not been completed

      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // When a user tried to access the completed Attractions page, go to the database grab all completed attractions by the logged in user and send it to the ejs
  getCompletedAttractions: async (req, res) => {

    try {

      // Go to the database, grab all the completed attractions by the logged in user
      const posts = await bookmarkedAttractionModel.find({ user: req.user.id, Complete: "true" })

      res.render("completedAttractions.ejs", {posts: posts, user: req.user})

    } catch (error) {
      
    }
  },

  // When user is on the profile page, their bookmarked attractions will be displayed. They have the option to click on an individual attraction
  getPost: async (req, res) => {
    try {
      // Post is the schema for a gernal post
      const post = await bookmarkedAttractionModel.findById(req.params.id); // .params.id getting the query paramater from the url


      res.render("post.ejs", { post: post, user: req.user}); //Once a post that machtes this id is found. Send it to the post.ejs. Also send the comment array

    } catch (err) {
      console.log(err);
    }
  },

  
  //When someone completes an attraction they will get the chance to review that attraction
  reviewAttraction: async (req,res) => {

    try {
      await bookmarkedAttractionModel.findOneAndUpdate( // Go into the database, find an attraction that matches this ID and update it. 
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
      await bookmarkedAttractionModel.findOneAndUpdate( // Go into the database, find an attraction that matches this ID and update it. 
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

    try {

      // Find post by id
      let post = await bookmarkedAttractionModel.findById({ _id: req.params.id });

      // Delete image from cloudinary. Not all attractions will have a cloudinary id. Those bookmarked from travel-advisor dont. 
      let cloud = await cloudinary

      // Do not assume the documnet in MongoDB has a cloudinaryId. Without this piece of code you woudn't be able to remove the attraction
      // if the attraction in mongoDB contains a cloudinary ID it means a user updoad the attraction. So remove the img from cloudinary
      if(cloud) {
        cloud.uploader.destroy(post.cloudinaryId); // This deletes it from cloudinary becuase we no longer need it
      }
      
      // Delete post from db
      await bookmarkedAttractionModel.remove({ _id: req.params.id });
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },

};