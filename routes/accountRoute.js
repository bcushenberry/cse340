// Needed Resources 
const router = require("express").Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/accountValidation");
const utilities = require("../utilities");

// Route to build account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin));

// Route to process registration data
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));


module.exports = router;