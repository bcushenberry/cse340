const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildDetailsPage = async function(data){
  let layout = '<section id="vehicle-display">'
  if(data.length > 0){
    data.forEach(vehicle => {
      layout += '<h3>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details' + '</h3>'
      layout += '<img src="' + vehicle.inv_image + '" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +'">'
      layout += '<ul id="vehicle-display-list>'
      layout += '<li><h4>' + 'Price: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h4></li>'
      layout += '<li><h4>' + 'Description: ' + '</h4>' + vehicle.inv_description + '</li>'
      layout += '<li><h4>' + 'Color: ' + '</h4>' + vehicle.inv_color + '</li>'
      layout += '<li><h4>' + 'Miles: ' + '</h4>' + vehicle.inv_miles + '</li>'
    });
    layout += '</ul>'
    layout += '</section>'
  } else { 
    layout += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return layout
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util