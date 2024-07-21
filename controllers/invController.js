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
  const classificationSelect = await utilities.buildClassificationList();
  req.flash("notice", "To add a new classification or item, please press the corresponding button.")
  req.flash("bad-notice", "Note: the delete buttons are still works in progress.")
  res.render("./inventory/admin", {
    title: "Inventory Management Page",
    nav,
    adminPage,
    classificationSelect,
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

// Build Add Inventory view
invControl.buildAddInventoryView = async function (req, res, next) {
  const classificationList = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
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
// Add new classificaiton
invControl.addClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name;
  const addClass = await invModel.addClassificationToDb(classification_name);
  if (addClass) {
    req.flash("notice", "Classification successfully added!");
    res.redirect("./admin");
  } else {
    req.flash("bad-notice", "Failed to add classification.");
    res.redirect("./add-classification");
  }
};

// Delete classificaiton
invControl.deleteClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name;
  if (!classification_name) {
    req.flash("bad-notice", "Classification name is required.");
    return res.redirect("./delete-classification");
  }

  const deleteClass = await invModel.deleteClassificationFromDb(
    classification_name
  );

  if (deleteClass.rowCount) {
    req.flash("notice", "Classification successfully deleted.");
    res.redirect("./admin");
  } else {
    req.flash("bad-notice", "Failed to delete classification. Perhaps there was a typo?");
    res.redirect("./delete-classification");
  }
};

// Add new inventory item
invControl.addInventory = async function (req, res, next) {
  const { inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body;

  const addItem = await invModel.addNewInventoryToDb({
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  });

  if (addItem) {
    req.flash("notice", "Item successfully added to inventory!");
    res.redirect("./admin");
  } else {
    req.flash("bad-notice", "Failed to add item.");
    res.redirect("./add-inventory");
  }
};

// Delete inventory item
invControl.deleteInventory = async function (req, res, next) {
  const inv_id = req.body.inv_id;
  if (!inv_id) {
    req.flash("bad-notice", "Item ID is required.");
    return res.redirect("./delete-inventory");
  }

  const deleteItem = await invModel.deleteInventoryFromDb(
    classification_name
  );

  if (deleteItem.rowCount) {
    req.flash("notice", "Item successfully deleted from inventory.");
    res.redirect("./admin");
  } else {
    req.flash("bad-notice","Failed to delete item. Perhaps there was a typo?");
    res.redirect("./delete-inventory");
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invControl.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invControl;
