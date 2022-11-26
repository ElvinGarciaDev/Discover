const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // Middleware that makes sure the user is logged in

const bookmarkAttractionController = require("../controllers/BookmarkAttraction");



//Main Routes - simplified for now
router.get("/", homeController.getIndex); // When the router hears this request go to this controller
router.get("/profile", ensureAuth, postsController.getProfile);


// Show the addAttraction page
router.get("/addAttraction", ensureAuth, postsController.getAttraction); //Pass in ensureAuth to make sure the user is logged in, 
// Go to the postsController and run the getAttraction method. This method tells it to render addAttraction.ejs

// Show the Search for attraction page
router.get("/searchActivity", ensureAuth, postsController.getSearchAttraction) //Pass in ensureAuth to make sure the user is logged in, 
// Go to the postsController and run the getSearchAttraction method. This method tells it to render SearchAttraction.ejs

// When user enteres a zipcode, it sends a fetch to the travel-advisor api and also to our own database. It finds any attractions uploaded by users that match the zipcode
router.get("/bookmarkAttraction/:zipcode", ensureAuth, bookmarkAttractionController.getAttractions) //Pass in ensureAuth to make sure the user is logged in, 
// Go to the postsController and run the getSearchAttraction method. This method tells it to render SearchAttraction.ejs
// :zipcode because the user will be sending over a zipcode when the fetch request is sent

// When someone wants to save an attraction
router.post("/addAttraction",ensureAuth, bookmarkAttractionController.bookmarkAttraction)


// Passport routes
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;