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
router.get(
  "/admin",
  utilities.handleErrors(invController.buildAdminView)
);

// Route to build the Add Classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassificationView)
);

// Route to build the Delete Classification view
router.get(
  "/delete-classification",
  utilities.handleErrors(invController.buildDeleteClassificationView)
);

// Route to build the Add Inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventoryView)
);

// Route to build the Delete Inventory view
//router.get("/delete-inventory", utilities.handleErrors(invController.buildDeleteInventoryView));

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to add a new classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to delete a classification
router.post(
  "/delete-classification",
  invValidate.classificationRules(),
  invValidate.checkAddClassificationData,
  utilities.handleErrors(invController.deleteClassification)
);

// Route to add a new item
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkAddInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to delete an item
router.post(
  "/delete-inventory",
  invValidate.inventoryRules(),
  invValidate.checkAddInventoryData,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
