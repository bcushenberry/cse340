// Needed Resources
const router = require("express").Router();
const errorController = require("../controllers/errorController");
const utilities = require("../utilities");

// Route to cause an intentional error
router.get("/detail/:invId", utilities.handleErrors(errorController.triggerError));

module.exports = router;