const invModel = require("../models/inventoryModel");
const utilities = require("../utilities/");

const invControl = {};

/* ***************************
 *  View Building Functions (GET)
 * ************************** */
// Build inventory by classification view
invControl.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const classificationName = data[0].classification_name;
  res.render("./inventory/classification", {
    title: classificationName + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

// Build detailed view for single inventory item
invControl.buildByInvId = async function (req, res, next) {
  //  console.log('Route handler invoked for /detail/:invId');
  const inv_id = req.params.invId;
  const data = await invModel.getVehicleDetailsByInvId(inv_id);
  const detailsPage = await utilities.builddetailsPage(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detailsPage,
    errors: null,
  });
};

// Build admin view
invControl.buildAdminView = async function (req, res, next) {
  const adminPage = await utilities.buildAdminPage();
  let nav = await utilities.getNav();
  res.render("./inventory/admin", {
    title: "Admin Page",
    nav,
    adminPage,
  });
};

// Build Add Classification view
invControl.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

// Build Add Item view
invControl.buildAddItemView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-item", {
    title: "Add New Inventory",
    nav,
  });
};

// Build Delete Classification view
invControl.buildDeleteClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/delete-classification", {
    title: "Delete Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Model Interfacing Functions (POST)
 * ************************** */

invControl.addClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name;
  console.log("Classification Name:", classification_name);
  const addClass = await invModel.addNewClassification(classification_name);
  if (addClass) {
    req.flash("notice", "Classification added.");
    res.redirect("./admin");
  } else {
    req.flash("notice", "Failed to add classification.");
  }
};

invControl.deleteClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name;
  console.log("Classification Name to Delete:", classification_name);
  if (!classification_name) {
    req.flash("notice", "Classification name is required.");
    return res.redirect("./delete-classification");
  }

  const deleteClass = await invModel.deleteClassification(classification_name);

  if (deleteClass.rowCount) {
    req.flash("notice", "Classification deleted.");
    res.redirect("./admin");
  } else {
    req.flash("notice", "Failed to delete classification. Perhaps there was a typo?");
    res.redirect("./delete-classification");
  }
};

module.exports = invControl;
