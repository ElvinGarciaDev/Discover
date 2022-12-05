// When a request to bookmark an attraction comes in

const express = require("express");
const router = express.Router();
const bookmarkAttractionController = require("../controllers/BookmarkAttraction");


// router.get("/searchActivity/bookmarkAttraction", bookmarkAttractionController.getAttractions); // The form acttion will be /post/createComment/<%= post.id %>

// When user enteres a zipcode, it sends a fetch to the travel-advisor api and also to our own database. It finds any attractions uploaded by users that match the zipcode
router.get("/:zipcode", bookmarkAttractionController.getAttractions) //Pass in ensureAuth to make sure the user is logged in, 
// Go to the postsController and run the getSearchAttraction method. This method tells it to render SearchAttraction.ejs
// :zipcode because the user will be sending over a zipcode when the fetch request is sent


// When someone wants to save an attraction
router.post("/addAttraction", bookmarkAttractionController.bookmarkAttraction)

module.exports = router;