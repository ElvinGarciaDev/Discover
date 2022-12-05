const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // Middleware that makes sure the user is logged in

// Controllers
const bookmarkAttractionController = require("../controllers/BookmarkAttraction");
const localUploadController = require("../controllers/localUpload")

//Main Routes - simplified for now
router.get("/", homeController.getIndex); // When the router hears this request go to this controller
router.get("/profile", ensureAuth, postsController.getProfile);


// Show the addAttraction page. Users know their city the best, they have the option to upload their own attration for others to visit
router.get("/addAttraction", ensureAuth, localUploadController.getAttraction); //Pass in ensureAuth to make sure the user is logged in, 
// Go to the postsController and run the getAttraction method. This method tells it to render addAttraction.ejs

// Show the Search for attraction page
router.get("/searchAttraction", ensureAuth, bookmarkAttractionController.getSearchAttraction) //Pass in ensureAuth to make sure the user is logged in, 
// Go to the postsController and run the getSearchAttraction method. This method tells it to render SearchAttraction.ejs


// When a user goes to the user tries to access the completed attractions page
router.get("/completedAttractions", ensureAuth, postsController.getCompletedAttractions)


// Passport routes
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;