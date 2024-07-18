// Needed Resources
const router = require("express").Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventoryValidation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to get single item ID and build the view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

// Route to build admin view
router.get("/admin", utilities.handleErrors(invController.buildAdminView));

// Route to build the Add Classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassificationView)
);

// Route to build the Add Item view
//router.get("/add-item", utilities.handleErrors(invController.buildAddItemView));

// Route to build the Delete Classification view
router.get(
  "/delete-classification",
  utilities.handleErrors(invController.buildDeleteClassificationView)
);

// Route to build the Delete Item view
//router.get("/delete-item", utilities.handleErrors(invController.buildDeleteItemView));

// Route to add a new classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to add a new item
//router.post("/add-item", invValidate.invItemRules(), invValidate.checkAddClassificationData, utilities.handleErrors(invController.addItem));

// Route to delete a classification
router.post(
  "/delete-classification",
  invValidate.classificationRules(),
  invValidate.checkAddClassificationData,
  utilities.handleErrors(invController.deleteClassification)
);

// Route to delete an item
//router.post("/delete-item", utilities.handleErrors(invController.deleteItem));

module.exports = router;
