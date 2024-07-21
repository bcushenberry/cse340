require("dotenv").config()
const jwt = require("jsonwebtoken")
const invModel = require("../models/inventoryModel");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = `<ul id="inv-display">`;
    data.forEach((vehicle) => {
      grid += `
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="A ${vehicle.inv_make} ${
        vehicle.inv_model
      } from ${vehicle.inv_year}">
          </a>
          <div id="namePrice">
            <hr>
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat("en-US").format(
              vehicle.inv_price
            )}</span>
          </div>
        </li>`;
    });
    grid += `</ul>`;
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
  }
  return grid;
};

/* **************************************
 * Build the classification drop-down list
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" value="<%= locals.classification_id %>" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList;
}

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.builddetailsPage = async function (data) {
  let detailsPage = `<section id="vehicle-details">`;
  if (data.length > 0) {
    data.forEach((vehicle) => {
      detailsPage += `
      <div id="details-page-img"><img src="${vehicle.inv_image}" alt="A ${
        vehicle.inv_year
      } ${vehicle.inv_make} ${vehicle.inv_model}"></div>
      <div id="details-page-info">
      <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
        <ul id="details-list">
          <li><span class="detail-name">Price:</span> $${new Intl.NumberFormat(
            "en-US"
          ).format(vehicle.inv_price)}</li>
          <li><span class="detail-name">Description:</span> ${
            vehicle.inv_description
          }</li>
          <li><span class="detail-name">Color:</span> ${vehicle.inv_color}</li>
          <li><span class="detail-name">Miles:</span> ${new Intl.NumberFormat(
            "en-US"
          ).format(vehicle.inv_miles)}</li>
        </ul>
      </div>
      `;
    });
  } else {
    detailsPage +=
      '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  detailsPage += `</section>`;
  return detailsPage;
};

/* **************************************
 * Build the admin view HTML
 * ************************************ */
Util.buildAdminPage = async function () {
  let adminPage = `
  <form class="account-forms" action="/inv/add-classification" method="get">
    <button class="admin-button" type="submit" value="Add Classification">Add Classification</button>
  </form>

  <form class="account-forms" action="/inv/delete-classification" method="get">
      <button class="admin-button" type="submit" value="Delete Classification">Delete Classification</button>
  </form>

  <form class="account-forms" action="/inv/add-inventory" method="get">
      <button class="admin-button" type="submit" value="Add Inventory Item">Add Inventory Item</button>
  </form>

  <form class="account-forms" action="/inv/delete-inventory" method="get">
    <button class="admin-button" type="submit" value="Delete Inventory Item">Delete Inventory Item</button>
  </form>
  `;
  return adminPage;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


module.exports = Util;
