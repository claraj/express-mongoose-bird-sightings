var moment = require('moment');

function formatDate(date) {
   // Get the UTC standard date version of this date
  m = moment.utc(date);
  // Format it for the current server timezone
  return m.parseZone().format('dddd, MMMM Do YYYY, h:mm a');
}

module.exports = {
  formatDate : formatDate
}
