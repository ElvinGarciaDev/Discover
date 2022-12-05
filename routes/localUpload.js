const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const localUploadController = require("../controllers/localUpload");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// When someone wants to upload an attraction in their area.
router.post("/createPost", upload.single("file"), localUploadController.createPost);

// 1st step in updating attraction. Click on an attraction
// When someone wants to update an attraction Show the updateAttraction page and get the attraction they want to update from MongoDB
router.get("/:id", ensureAuth, localUploadController.updateAttraction)

//2nd step, change any field in the form
// Users have the option to change fields on the updateAttraction.ejs form
router.put("/updateAttraction/:id", localUploadController.updateLocalAttraction);

// If user who uploaded an attraction wants to delete it
router.delete("/:id", localUploadController.deleteLocalAttraction);



module.exports = router;