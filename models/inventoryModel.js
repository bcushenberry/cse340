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
 *  Add and delete classifications
 * ******************************** */
async function addClassificationToDb(class_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification
      (classification_name)
      VALUES
      ($1)
      RETURNING *`,
      [class_name]
    );
    console.log("Add Classification Result:", data.rows);
    return data.rows;
  } catch (error) {
    console.error("addclassificationtodb error" + error);
    return null;
  }
}

async function deleteClassificationFromDb(class_name) {
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
    console.error("deleteclassification error" + error);
    return null;
  }
}

/* ***************************
 *  Add and delete inventory
 * *************************** */

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
    console.log("Add Item Result:", data.rows);
    return data.rows;
  } catch (error) {
    console.error("addnewinventorytodb error" + error);
    return null;
  }
}

async function deleteInventoryFromDb(inv_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.inventory
      WHERE inv_id = $1
      RETURNING *`,
      [inv_id]
    );
    console.log("Delete Inventory Result:", data.rows);
    return data;
  } catch (error) {
    console.error("deleteinventoryfromdb error" + error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleDetailsByInvId,
  addClassificationToDb,
  deleteClassificationFromDb,
  addNewInventoryToDb,
  deleteInventoryFromDb
};
