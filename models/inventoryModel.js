const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

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

/* ***************************
 *  Add classification and add inventory items
 * ************************** */
async function addNewClassification(class_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification
      (classification_name)
      VALUES
      ($1)
      RETURNING *`, [class_name]
    );
    console.log("Add Classification Result:", data.rows);
    return data.rows;

  } catch (error) {
    console.error("addnewclassification error" + error)
    return null;
  }
}

async function deleteClassification(class_name) {
  try {
    const data = await pool.query(
      `DELETE FROM public.classification
      WHERE classification_name = $1
      RETURNING *`,
      [class_name]
    );
    console.log("Delete Classification Result:", data.rows);
    return data;

  } catch (error) {
    console.error("deleteclassification error" + error)
    return null;
  }
}


module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getVehicleDetailsByInvId, 
  addNewClassification, 
  deleteClassification,
};