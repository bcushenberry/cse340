// Needed Resources 
const router = require("express").Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/accountValidation");
const utilities = require("../utilities");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process login attempt
router.post("/login", (req, res) => {
  res.status(200).send('login process')
  }
);

// Route to process registration data
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));

module.exports = router;