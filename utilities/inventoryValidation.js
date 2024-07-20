const invModel = require("../models/inventoryModel");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a car make."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a car model."),

    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("The year must be a numerical value")
    .isLength({ min: 4, max: 4 })
    .withMessage("The year must be four digits."),

    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Please provide a description of at least 5 characters."),

    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a proper image path."),

    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a proper image path."),

    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("The price must be a numerical value")
    .isLength({ min: 1 })
    .withMessage("Please provide a proper price."),

    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("The mileage must be a numerical value")
    .isLength({ min: 1 })
    .withMessage("Please provide the car's mileage."),

    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a color for the car."),

    body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a classification."),
  ]
}

validate.classificationRules = () => {
  return [
    // Classification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Please provide a valid classification name."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or proceed to add a classification
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.checkAddInventoryData = async (req, res, next) => {
  const classificationList = await utilities.buildClassificationList();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
    });
    return;
  }
  next();
};


module.exports = validate;
