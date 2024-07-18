const invModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const errorControl = {}

errorControl.triggerError = async function (req, res, next) {
//  console.log('Route handler invoked for /detail/:invId');
  const inv_id = req.params.invId
  const data = await invModel.getVehicleDetailsByInvId(inv_id)
  const detailsPage = await utilities.builddetailsPage(data)
//  let nav = await utilities.getNav()
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./trigger/detail", { 
    title: vehicleName, 
    nav, 
    detailsPage,
    errors: null,
  })
}

module.exports = errorControl;