// Needed Resources
const router = require("express").Router();
const errorController = require("../controllers/errorController");

// I don't think we need the error handler because we're meant to cause an error, but just in case:
// const utilities = require("../utilities");

// Route to cause an intentional error
router.get("/detail/:invId", errorController.triggerError);

module.exports = router;