const invModel = require("../models/inventoryModel");
const utilities = require("../utilities/");

const invControl = {};

/* *********************************
 *  Classification-related functions
 * ******************************** */

/****** Building Views (GET) ******/

// Build Inventory by Classification View
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

// Build Add Classification View
invControl.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

// Build Delete Classification View
invControl.buildDeleteClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/delete-classification", {
    title: "Delete Classification",
    nav,
    errors: null,
    classificationSelect,
  });
};

// Return Inventory by Classification As JSON 
invControl.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/****** Add/Delete (POST) ******/

// Add New Classificaiton
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

// Delete Classificaiton
invControl.deleteClassification = async function (req, res, next) {
  const classification_id = req.body.classification_id;
  if (!classification_id) {
    req.flash("bad-notice", "Please select a classification.");
    return res.redirect("./delete-classification");
  }

  try {
    const deleteClass = await invModel.deleteClassificationFromDb(classification_id);

    if (deleteClass) {
      req.flash("notice", "Classification successfully deleted.");
      res.redirect("./admin");
    } else {
      req.flash("bad-notice", "Failed to delete classification. Please try again.");
      res.redirect("./delete-classification");
    }
  } catch (error) {
    req.flash("bad-notice", "Error deleting classification: " + error.message);
    res.redirect("./delete-classification");
  }
};

/* *********************************
 *  Inventory-related functions
 * ******************************** */

/****** Building Views (GET) ******/

// Build Detailed View (single inventory item)
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

// Build Add Inventory View
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

// Build Edit Inventory View
invControl.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDetailsByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

// Build Delete Inventory Confirmation View
invControl.buildDeleteConfirmationView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDetailsByInvId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price
  })
}

/****** Add/Delete (POST) ******/

// Add Inventory (Single Item)
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

// Edit Inventory (Single Item)
invControl.editInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const editResult = await invModel.editInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (editResult) {
    const itemName = editResult.inv_make + " " + editResult.inv_model
    req.flash("notice", `Details for the ${itemName} have been successfully edited.`)
    res.redirect("/inv/admin")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("bad-notice", "Sorry, the edit failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

// Delete Inventory (Single Item)
invControl.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryFromDb(inv_id)

  if (deleteResult) {
    req.flash("notice", `Vehicle successfully deleted!`)
    res.redirect("/inv/admin")
  } else {
    req.flash("bad-notice", "Failed to delete vehicle.")
    res.status(501).redirect("inventory/delete-inventory/" + inv_id)
  }
}

/* ***************************
 *  Admin
 * ************************** */

// Build Admin View
invControl.buildAdminView = async function (req, res, next) {
  const adminPage = await utilities.buildAdminPage();
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/admin", {
    title: "Inventory Management Page",
    nav,
    adminPage,
    classificationSelect,
  });
};

module.exports = invControl;
