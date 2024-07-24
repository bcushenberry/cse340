require("dotenv").config()
const utilities = require("../utilities")
const accountModel = require("../models/accountModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccountView(req, res) {
  let nav = await utilities.getNav()
  const account_type = res.locals.accountData.account_type
  const account_firstname = res.locals.accountData.account_firstname
  const account_id = res.locals.accountData.account_id
  res.render("account/landing-page", {
    title: "Account Management",
    nav,
    account_type,
    account_firstname,
    account_id,
    errors: null,
  })
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistrationView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null, 
  })
}

/* ****************************************
*  Deliver update view
* *************************************** */
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname = res.locals.accountData.account_lastname
  const account_email = res.locals.accountData.account_email
  const account_id = res.locals.accountData.account_id
  res.render("account/update"/* + account_id */, {
    title: "Update Account Info",
    nav,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("bad-notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice",`Congratulations, you\'re registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("bad-notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }

  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error("Access Forbidden")
  }
 }
 
/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  console.log(account_firstname, account_lastname, account_email, account_id)
  const updateResult = await accountModel.updateAccountinDb(account_firstname, account_lastname, account_email, account_id)
  try {
    if (updateResult) {
      const updatedData = await accountModel.getAccountById(account_id)
      const accessToken = jwt.sign(updatedData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })

      req.flash("notice", "Info updated successfully!")
      res.redirect("/account")
    } else {
      req.flash("bad-notice", "Failed to update account information.")
      res.status(501).render("account/update/"/* + account_id */, {
        title: "Update Account Info",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (error) {
    req.flash("bad-notice", "Error updating account info: " + error.message);
    res.redirect("/account/update/"/* + account_id */);
  }
}
/* ****************************************
*  Change Password
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  let hashedPassword;

  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    const result = await accountModel.updatePassword(hashedPassword, account_id)
    
    if (result) {
      const updatedData = await accountModel.getAccountById(account_id)
      const accessToken = jwt.sign(updatedData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })

      req.flash("notice", "Password updated successfully!")
      res.redirect("/account")
    } else {
      req.flash("bad-notice", "Failed to change password.")
      res.status(501).render("account/update/"/* + account_id */, {
        title: "Update Account Info",
        nav,
        errors: null,
      })
    }

  } catch (error) {
    req.flash("bad-notice", "Sorry, there was an error changing your password.")
    res.status(500).render("account/update/"/* + account_id */, {
      title: "Update Account Info",
      nav,
      errors: null,
    })
  }
}

  module.exports = { buildAccountView, buildLoginView, buildRegistrationView, buildUpdateView, registerAccount, accountLogin, updateAccount }