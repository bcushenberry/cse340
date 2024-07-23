const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * *************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ********************************
 *  Get individual vehicle details
 * ******************************** */
async function getVehicleDetailsByInvId(inv_Id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_Id]
    );
    return data.rows;
  } catch (error) {
    console.error("getvehicledetailsbyinvid error " + error);
  }
}

/* ********************************
 *  Add classification
 * ******************************** */
async function addClassificationToDb(classification_id) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification
      (classification_name)
      VALUES
      ($1)`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("addclassificationtodb error" + error);
  }
}

/* ********************************
 *  Delete classification
 * ******************************** */
async function deleteClassificationFromDb(classification_id) {
  try {
    const data_i = await pool.query(
      `DELETE FROM public.inventory WHERE classification_id = $1`,
      [classification_id]
    );
    const data_c = await pool.query(
      `DELETE FROM public.classification WHERE classification_id = $1`,
      [classification_id]
    );
    return data_i, data_c;
  } catch (error) {
    throw new Error("Delete Classification Error: " + error.message);
  }
}

/* ***************************************
 *  Add Inventory Data
 * ************************************ */

async function addNewInventoryToDb(new_item) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
      } = new_item;
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]
    );
    return data.rows;
  } catch (error) {
    new Error("Add Inventory Error")
  }
}

/* ***************************
 *  Edit Inventory Data
 * ************************** */
async function editInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    new Error("Edit Inventory Error")
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventoryFromDb(inv_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data;
  } catch (error) {
      new Error("Delete Inventory Error")
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleDetailsByInvId,
  addClassificationToDb,
  editInventory,
  deleteClassificationFromDb,
  addNewInventoryToDb,
  deleteInventoryFromDb
};
