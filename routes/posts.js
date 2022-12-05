const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost); //You can grab the query paramater with :id. :id is creating a paramter that will hold the query paramater
// ensureAuth to make sure your logged in. :id we cna call it whatever we want. It's just a parameter
// the route is example: http://localhost:8000/post/637531bdb674a3719be5932d . When you click to go to a post directly it sends a get request because
// it's in a <a> tag

router.put("/reviewAttraction/:id", postsController.reviewAttraction); // When someone completes an attraction they will get the chance to review that attraction

router.put("/completeAttraction/:id", postsController.completeAttraction); // When a user click to mark the attraction as complete, run this method in the postsController


router.delete("/deletePost/:id", postsController.deletePost); // When a user click to delete an attraction, run this method in the postsController

module.exports = router;