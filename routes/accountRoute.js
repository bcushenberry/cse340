// Needed Resources 
const router = require("express").Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/accountValidation");
const utilities = require("../utilities");

// Route to build account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountView));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Route to process login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistrationView));

// Route to process registration data
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));

// Route to build update view
router.get("/update/", utilities.handleErrors(accountController.buildUpdateView));

// Route to update account info
router.post("/update", utilities.handleErrors(accountController.updateAccount));

module.exports = router;