const { getTrips, getDriver } = require("api");

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  const getTrip = await getTrips();
  const calculatedTrips = calculateTrips(getTrip);

  let arrayOfTripsDriverID = [];
  let driverID = [];
  let driverInfo = [];
  let noOfDriversWithMoreThanOneVehicle = 0;

  for (let trips of getTrip) {
   
    arrayOfTripsDriverID.push(trips.driverID);
  }

  let errTripDriverId = arrayOfTripsDriverID.pop();
  let uniqueDriverID = new Set([...arrayOfTripsDriverID]);


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
  
    tripCounter[data] ? (tripCounter[data] += 1) : (tripCounter[data] = 1);
  });


  let highestTrips = Math.max(...Object.values(tripCounter));
  console.log(highestTrips);
  let highestTripsIndex = Object.values(tripCounter).indexOf(highestTrips);
  let highestTripsDriver = Object.keys(tripCounter)[highestTripsIndex];

  // Using the utility function to get the driver Earnings initially stored in an array
  let driverEarnings = calculatedTrips.amountEarnedByDriver;

  let totalAmountEarned = driverEarnings[highestTripsDriver];
  console.log(totalAmountEarned);
  // Using ES6 to destructure driver info
  let mostTripsByDriver = resolvedDriverID[highestTripsIndex];
  
  const { name, email, phone } = mostTripsByDriver;
  // getting driver with the highest Earnings
  let earningsObject = Object.assign({}, driverEarnings);
  
  let maxEarnings = Math.max(...Object.values(earningsObject));
  
  let maxEarningDriverIndex =  Object.values(earningsObject).indexOf(maxEarnings);
 
  let maxEarningDriver = Object.keys(earningsObject)[highestTripsIndex];

  // // using ES6 to destructure hihgest earning driver info
  let highestEarningDriver = resolvedDriverID[maxEarningDriverIndex];
  
  let noOfTrips2 = Object.values(tripCounter)[highestTripsIndex];
  console.log(noOfTrips2);
  // getting trips by highest earning driver
  let noOfTripsByHighestEarningDriver = 0;
  arrayOfTripsDriverID.map((data) => {
    if (data === maxEarningDriver) {
      noOfTripsByHighestEarningDriver++;
    }
  });
  console.log(noOfTripsByHighestEarningDriver);

  return getTrip.reduce((tripAnalysis, val) => {
    return tripAnalysis = {
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
    };
  }, {});
}
analysis();

//Utility function 1
/**
 * function to calculate the number of cashTrips, non cash trips , from getTrip dataBase
 * @param {Object}
 * @returns {object}
 */
const calculateTrips = (getTrip) => {
  
  let cashTrips = 0;
  let nonCashTrips = 0;
  let billedTotal = 0;
  let cashBilledTotal = 0;
  let nonCashBilledTotal = 0;
  let amountEarnedByDriver = [];
  // looping through the getTrips data
  for (let trips of getTrip) {
    //removing the commas and convert bill amount to integer
    let resolvedBills = Number(
      trips.billedAmount.toString().split(",").join("")
    );
    if (trips.billedAmount) {
      billedTotal += resolvedBills;
      amountEarnedByDriver[trips.driverID]
        ? (amountEarnedByDriver[trips.driverID] += resolvedBills)
        : (amountEarnedByDriver[trips.driverID] = resolvedBills);
    }
    if (trips.isCash == true) {
      cashTrips += 1;
      cashBilledTotal += resolvedBills;
    } else if (trips.isCash == false) {
      nonCashTrips += 1;
      nonCashBilledTotal += resolvedBills;
    }
  }

  // Second loop to

  return {
    cashTrips: cashTrips,
    nonCashTrips: nonCashTrips,
    billedTotal: billedTotal,
    cashBilledTotal: cashBilledTotal,
    nonCashBilledTotal: nonCashBilledTotal,
    amountEarnedByDriver: amountEarnedByDriver,
  };
};
// console.log(driveInfo())
module.exports = analysis;
// console.log(driveInfo())
module.exports = analysis;

// {
