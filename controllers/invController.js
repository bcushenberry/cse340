const invModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const invControl = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invControl.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invControl.buildByInvId = async function (req, res, next) {
  console.log('Route handler invoked for /detail/:invId');
  const inv_id = req.params.invId
  const data = await invModel.getVehicleDetailsByInvId(inv_id)
  const detailsPage = await utilities.builddetailsPage(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/detail", { 
    title: vehicleName, 
    nav, 
    detailsPage,
  })
}

module.exports = invControl;