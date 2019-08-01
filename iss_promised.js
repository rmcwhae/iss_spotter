const request = require('request-promise-native');

/*
 * Gets public IP
 */
const fetchMyIP = function() {
  return request('https://api.ipify.org/?format=json');
};

/*
 * Makes a request to ipvigilante.com using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(body) {
  const IP = JSON.parse(body).ip;
  return request('https://ipvigilante.com/json/' + IP);
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body).data;
  return request('http://api.open-notify.org/iss-pass.json?lat=' + latitude + '&lon=' + longitude);
};

const printPassTimes = function(object) {
  for (let passTime of object) {
    let date = new Date(0);
    date.setUTCSeconds(passTime.risetime);
    console.log('Next pass at ' + date + ' for ' + passTime.duration + ' seconds!');

  }
};


const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(data => {
      const {response } = JSON.parse(data);
      return response;
    });
};


module.exports = { nextISSTimesForMyLocation, printPassTimes };