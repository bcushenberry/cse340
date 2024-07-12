const invModel = require("../models/inventory-model")
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
  const inv_id = req.params.invId
  const data = await invModel.getVehicleDetailsByInvId(inv_id)
  const layout = await utilities.buildDetailsPage(data)
  let nav = await utilities.getNav()
  const vehicleName = data ?  `${data.inv_make} ${data.inv_model}` : 'Unknown'; 
  res.render("./inventory/detail", { 
    title: vehicleName, 
    nav, 
    layout,
  })
}

module.exports = invControl;