// Needed Resources
const router = require("express").Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventoryValidation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to get single item ID and build the view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to build admin view
router.get("/admin", utilities.checkRole, utilities.handleErrors(invController.buildAdminView));

// Route to build the Add Classification view
router.get("/add-classification", utilities.checkRole, utilities.handleErrors(invController.buildAddClassificationView));

// Route to add a new classification
router.post("/add-classification", utilities.checkRole, invValidate.classificationRules(), invValidate.checkAddClassificationData, utilities.handleErrors(invController.addClassification));

// Route to build the Delete Classification view
router.get("/delete-classification", utilities.checkRole, utilities.handleErrors(invController.buildDeleteClassificationView));

// Route to delete a classification
router.post("/delete-classification", utilities.checkRole, utilities.handleErrors(invController.deleteClassification));

// Route to build the inventory in the management view
router.get("/get-inventory/:classification_id", utilities.checkRole, utilities.handleErrors(invController.getInventoryJSON));

// Route to build the Add Inventory view
router.get("/add-inventory", utilities.checkRole, utilities.handleErrors(invController.buildAddInventoryView));

// Route to add a new item
router.post("/add-inventory", utilities.checkRole, invValidate.inventoryRules(), invValidate.checkAddInventoryData, utilities.handleErrors(invController.addInventory));

// Route to build the Delete Item confirmation view
router.get("/delete-inventory/:inv_id", utilities.checkRole, utilities.handleErrors(invController.buildDeleteConfirmationView));

// Route to delete an item
router.post("/delete-inventory/", utilities.checkRole, utilities.handleErrors(invController.deleteInventory));

// Route to build the view for editing an item
router.get("/edit-inventory/:inv_id", utilities.checkRole, utilities.handleErrors(invController.editInventoryView));

router.post("/edit-inventory/", utilities.checkRole, invValidate.newInventoryRules(), invValidate.checkEditInventoryData, utilities.handleErrors(invController.editInventory));

module.exports = router;