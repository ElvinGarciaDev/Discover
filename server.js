const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Handle interaction with out database.
const passport = require("passport"); // For handleing autothac
const session = require("express-session"); // Enable us to stay logged in
const MongoStore = require("connect-mongo")(session); // Enable us to stay logged in. Someone can close their browser, come back and stay logged in
const methodOverride = require("method-override"); // So we don't have to use client side javascript
const flash = require("express-flash"); // Notification for when error happens. EX: Email has been used error. 
const logger = require("morgan");
const connectDB = require("./config/database"); // Holds our Database connect
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");

const bookmarkAttraction = require("./routes/bookmarkAttraction") // Bring in the routes comments

// Axios???
const axios = require('axios');
const fetch = require('node-fetch')




//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing so we can look at the stuff coming in from the forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes); // If any '/' route come in. Use the mainRoutes file
app.use("/post", postRoutes); // If any /post routes come in. Use the postRoutes
app.use("/bookmarkAttraction", bookmarkAttraction) // For any routes that use the /comment go to this router

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});

const Comment = require("./models/Post")

app.put("/:id", async (req, res) => {

  console.log(req.body)
  console.log("hello")

  // Loop through the object that came in and delete any keys that are empty. This prevents any fields that were left empty in the form not be updated to empty fields in the database
  Object.keys(req.body).forEach(key => {
    if (req.body[key] === null || req.body[key] === undefined || req.body[key] === '') {
        delete req.body[key]
    }
})

  try {
    await Comment.findOneAndUpdate( // Go into the database, find an attraction that matches this ID and update it. 
      { _id: req.body.postID},
      {
        $set: req.body // Once founded, just update any matching fileds
      }
    );
    res.redirect(`/profile`);
  } catch (err) {
    console.log(err);
  }
})