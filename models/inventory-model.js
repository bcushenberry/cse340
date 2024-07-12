const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
/* Not sure if ths is needed
async function getVehicleDetails(){
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id")
} */

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleDetailsByInvId(inv_Id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_Id]
    )
    return data.rows
  } catch (error) {
    console.error("getvehicledetailsbyinvid error " + error)
  }
}


module.exports = {getClassifications, /* getVehicleDetails, */ getInventoryByClassificationId, getVehicleDetailsByInvId};