const memberQueries = require('./MemberQueries');
const classQueries = require('./ClassQueries'); // Assuming you have ClassQueries.js
const userQueries = require('./UserQueries'); // Assuming you have userQueries.js
const categoryQueries = require('./CategoryQueries'); // Assuming you have categoryQueries.js
const packageQueries = require('./PackageQueries'); // Assuming you have packageQueries.js
const staffQueries = require('./staffQueries'); // Assuming you have staffQueries.js


module.exports = {
  ...userQueries,
  ...categoryQueries,
  ...classQueries,
  ...memberQueries,
  ...packageQueries,
  ...staffQueries,
  
};


