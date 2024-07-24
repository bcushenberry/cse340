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
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView));

// Route to update account info
router.post("/update", utilities.checkLogin, regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount));

// Route to change password
router.post("/change-password", utilities.checkLogin, regValidate.changePasswordRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.changePassword));

// Route for logout
router.get("/logout", (req, res) => {res.clearCookie('jwt'), req.flash('notice', 'You have been logged out.'), res.redirect('/')});

module.exports = router;