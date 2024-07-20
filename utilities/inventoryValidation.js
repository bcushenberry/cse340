const invModel = require("../models/inventoryModel");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Please provide a classification."),

    body("inv_make")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Please provide a car make.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("The car make must only contain alphanumeric characters."),

    body("inv_model")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Please provide a car model.")
      .matches(/^[a-zA-Z0-9][a-zA-Z0-9\s]+$/)
      .withMessage("The model name must only contain alphanumeric characters & spaces."),

    body("inv_year")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("The year must be a numerical value")
      .isLength({ min: 4, max: 4 })
      .withMessage("The year must be four digits."),

    body("inv_description")
      .trim()
      .escape()
      .isString()
      .isLength({ min: 5 })
      .withMessage("Please provide a description of at least 5 characters."),

    body("inv_image")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Please provide a path for the image.")
      .matches(/^\/images\/vehicles\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/)
      .withMessage("Ensure the path is an image in /images/vehicles/"),

    body("inv_thumbnail")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Please provide a path for the thumbnail.")
      .matches(/^\/images\/vehicles\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/)
      .withMessage("Ensure the path is a thumbnail in /images/vehicles/"),

    body("inv_price")
      .trim()
      .escape()
      .isLength({ min: 1, max: 9 })
      .withMessage("Please provide a price.")
      .isNumeric()
      .withMessage("The price must be a numerical value"),

    body("inv_miles")
      .trim()
      .escape()
      .isLength({ min: 1, max: 6 })
      .withMessage("Please provide the car's mileage.")
      .isNumeric()
      .withMessage("The mileage must be a numerical value"),

    body("inv_color")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Please provide a color for the car.")
      .matches(/^[a-zA-Z][a-zA-Z\s]+$/)
      .withMessage("The color must contain only letters and spaces.")
  ]
}

validate.classificationRules = () => {
  return [
    // Classification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .isString()
      .isLength({ min: 2 })
      .withMessage("The classification name must be at least two letters long.")
      .matches(/^[a-zA-Z]+$/)
      .withMessage("The classification name must use only letters."), // on error this message is sent.
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
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  const classificationList = await utilities.buildClassificationList(classification_id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    });
    return;
  }
  next();
};


module.exports = validate;
