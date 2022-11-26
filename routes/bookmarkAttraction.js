// When a request to bookmark an attraction comes in

const express = require("express");
const router = express.Router();
const bookmarkAttractionController = require("../controllers/BookmarkAttraction");


router.get("/searchActivity/bookmarkAttraction", bookmarkAttractionController.getAttractions); // The form acttion will be /post/createComment/<%= post.id %>

module.exports = router;