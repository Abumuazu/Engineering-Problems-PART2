const { getTrips, getDriver } = require("api");
const { calculateTrips } = require('./utils/calculateTrips');

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  const getTrip = await getTrips();
  const calculatedTrips = calculateTrips(getTrip);

  // array to hold driver id from GETTRIPS
  let arrayOfTripsDriverID = [];
  // array to hold driver id from getDriver
  let driverID = [];
  // INITIALIZING VARIABLE TO COUNT DRIVERS WITH MORE THAN ONE VEHICLE
  let noOfDriversWithMoreThanOneVehicle = 0;

  for (let trips of getTrip) {
    arrayOfTripsDriverID.push(trips.driverID);
  }

  let errTripDriverId = arrayOfTripsDriverID.pop();
  let uniqueDriverID = new Set([...arrayOfTripsDriverID]);

  // LOOP TO GET THE DRIVERS ID FROM GETDRIVER
  Array.from(uniqueDriverID).map(async (value, index) => {
    driverID.push(getDriver(value));
  });

  //resolving promise with async await
  let resolvedDriverID = await Promise.all(driverID);

  // Loop to get drivers with more than one vehicle
  resolvedDriverID.map((data) => {
    if (data.vehicleID.length > 1) {
      noOfDriversWithMoreThanOneVehicle++;
    }
  });
  // Loop to get the number of trips by each driver
  let tripCounter = {};
  arrayOfTripsDriverID.map((data) => {
    //creating an object counter
    tripCounter[data] ? (tripCounter[data] += 1) : (tripCounter[data] = 1);
  });
  // logic to get the driver with the highest trip
  let highestTrips = Math.max(...Object.values(tripCounter));
  let highestTripsIndex = Object.values(tripCounter).indexOf(highestTrips);
  let highestTripsDriver = Object.keys(tripCounter)[highestTripsIndex];
  // Using the utility function to get the driver Earnings in an objectCounter format
  let driverEarnings = calculatedTrips.amountEarnedByDriver;
  // using the object counter to pick out earnings of driver with the highest trip
  let totalAmountEarned = driverEarnings[highestTripsDriver];
  // Using ES6 to destructure driver info
  let mostTripsByDriver = resolvedDriverID[highestTripsIndex];
  const { name, email, phone } = mostTripsByDriver;
  // getting driver with the highest Earnings
  let maxEarnings = Math.max(...Object.values(driverEarnings));
  let maxEarningDriverIndex =
    Object.values(driverEarnings).indexOf(maxEarnings);
  let maxEarningDriver = Object.keys(driverEarnings)[highestTripsIndex];
  // getting the info of the driver with the hihest earning
  let highestEarningDriver = resolvedDriverID[maxEarningDriverIndex];
  // getting trips by highest earning driver using his ID as a refrence
  let noOfTripsByHighestEarningDriver = 0;
  arrayOfTripsDriverID.map((data) => {
    if (data === maxEarningDriver) {
      noOfTripsByHighestEarningDriver++;
    }
  });
  // using Reduce to return our required format
  return getTrip.reduce((tripAnalysis, val) => {
    return (tripAnalysis = {
      ...tripAnalysis,
      noOfCashTrips: calculatedTrips.cashTrips,
      noOfNonCashTrips: calculatedTrips.nonCashTrips,
      billedTotal: Number(calculatedTrips.billedTotal.toFixed(2)),
      cashBilledTotal: calculatedTrips.cashBilledTotal,
      nonCashBilledTotal: Number(calculatedTrips.nonCashBilledTotal.toFixed(2)),
      noOfDriversWithMoreThanOneVehicle: noOfDriversWithMoreThanOneVehicle,
      mostTripsByDriver: {
        name: name,
        email: email,
        phone: phone,
        noOfTrips: highestTrips,
        totalAmountEarned: totalAmountEarned,
      },
      highestEarningDriver: {
        name: highestEarningDriver.name,
        email: highestEarningDriver.email,
        phone: highestEarningDriver.phone,
        noOfTrips: noOfTripsByHighestEarningDriver,
        totalAmountEarned: maxEarnings,
      },
    });
  }, {});
}
analysis();

//Utility function 1
/**
 * function to calculate the number of cashTrips, non cash trips , from getTrip dataBase
 * @param {Object}
 * @returns {object}
 */

module.exports = analysis;
