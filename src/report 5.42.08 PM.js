const { getTrips, getDriver, getVehicle } = require("api");

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  let getTrip = await getTrips();
  let calculateIndividualTrip = calculateIndividualTrips(getTrip);

  let tripDriverID = [];
  let driverID = [];
  // Loop to extract driverID
  for (let trip of getTrip) {
    let tripID = trip.driverID;
    tripDriverID.push(tripID);
    let driverInfo = getDriver(tripID);
    driverID.push(driverInfo);
  }
  // loop to extract the number of trip of each driver
  let tripCounter = {};
  tripDriverID.map((data) => {
    tripCounter[data] ? (tripCounter[data] += 1) : (tripCounter[data] = 1);
  });
  // getting the noOfTrips in and array
  let arrayOfNoOfTrips = Object.values(tripCounter);

  // getting the unique Id of drivers from getTrips
  let uniqueTripID = [...new Set(tripDriverID)];

  // resolving driverID promise
  let catchErrDriverID = await Promise.allSettled(driverID);

  // loop to extract only resolver/Valid driverId from
  let resolvedDriverInfo = [];
  catchErrDriverID.forEach((data, index) => {
    if (data.status === "fulfilled") {
      resolvedDriverInfo.push(data.value);
    }
  });

  // loop to get number of vehicles in an array
  let noOfVehicles = [];
  let vehicles = [];
  resolvedDriverInfo.map((data) => {
    let vehicleNum = data.vehicleID.length;
    noOfVehicles.push(vehicleNum);
    let vehicleArray = [data.vehicleID];

    for (let ids of vehicleArray) {
      for (let id of ids) {
        let getVehicles = getVehicle(id);
        // const {manufacturer, plate } = getVehicles
        vehicles.push(getVehicles);
        // vehicle.push(await getVehicles)
      }
    }
  });
  // convert the result of vehicle = [] from promise to data
  let resolvedVehicles = await Promise.all(vehicles);
  //Looping thrpugh resolvedVehicle to destructure just manufacturer and plate , which is what we need to
  let vehiclesInfo = [];
  resolvedVehicles.map((data) => {
    const { plate, manufacturer } = data;
    vehiclesInfo.push({ plate, manufacturer });
  });

  // geting Unique Driver Info from resolvedDriverInfo
  let uniqueDriverID = [...new Set(resolvedDriverInfo)];

  return uniqueDriverID.reduce((report, val, index) => {
    return (report = {
      ...report,
      fullName: val.name,
      id: uniqueTripID[index],
      phone: val.phone,
      noOfTrips: arrayOfNoOfTrips[index],
      noOfVehicles: noOfVehicles[index],
      vehicles: [vehiclesInfo[index]],
      noOfCashTrips: calculateIndividualTrip.noOfCashTrips[index],
      noOfNonCashTrips: calculateIndividualTrip.noOfnonCashTrips[index],
      totalAmountEarned: calculateIndividualTrip.totalAmountEarned[index],
      totalCashAmount: calculateIndividualTrip.totalCashAmount[index],
      totalNonCashAmount: calculateIndividualTrip.totalNonCashAmount[index],
      trips: calculateIndividualTrip.infoPerTripKeys[index],
    });
  }, {});
}
console.log(driverReport());

//Utility function 1
/**
 * function to help calculate and store in an array the number of cashTrips,
 * non cash trips, total cash amount, nonCash amount, toalAmount and infoPerTrip
 * of EACH Driver
 * @param {Object}
 * @returns {any}
 */
const calculateIndividualTrips = (getTrip) => {
  let cashTripCounter = {};
  let nonCashTripCounter = {};
  let totalAmountEarnedCounter = {};
  let totalCashAmountCounter = {};
  let totalNonCashAmountCounter = {};
  let infoPerTrip = {};
  // looping through the getTrips data
  for (let trips of getTrip) {
    //removing the commas and convert bill amount to integer
    let resolvedBills = Number(
      trips.billedAmount.toString().split(",").join("")
    );
    if (infoPerTrip[trips.driverID]) {
      infoPerTrip[trips.driverID].push({
        user: trips.user.name,
        created: trips.created,
        pickup: trips.pickup,
        destination: trips.destination,
        billed: resolvedBills,
        isCash: trips.isCash,
      });
    } else {
      infoPerTrip[trips.driverID] = [
        {
          user: trips.user.name,
          created: trips.created,
          pickup: trips.pickup,
          destination: trips.destination,
          billed: resolvedBills,
          isCash: trips.isCash,
        },
      ];
    }
    if (trips.billedAmount) {
      totalAmountEarnedCounter[trips.driverID]
        ? (totalAmountEarnedCounter[trips.driverID] += resolvedBills)
        : (totalAmountEarnedCounter[trips.driverID] = resolvedBills);
    }
    if (trips.isCash == true) {
      //Counting the bill for cash trip
      cashTripCounter[trips.driverID]
        ? (cashTripCounter[trips.driverID] += 1)
        : (cashTripCounter[trips.driverID] = 1);
      // getting the total amount earned
      totalCashAmountCounter[trips.driverID]
        ? (totalCashAmountCounter[trips.driverID] += resolvedBills)
        : (totalCashAmountCounter[trips.driverID] = resolvedBills);
    } else if (trips.isCash == false) {
      // geeting the count of NOT CASH
      nonCashTripCounter[trips.driverID]
        ? (nonCashTripCounter[trips.driverID] += 1)
        : (nonCashTripCounter[trips.driverID] = 1);
      // getting the  bill of NOT CASH
      totalNonCashAmountCounter[trips.driverID]
        ? (totalNonCashAmountCounter[trips.driverID] += resolvedBills)
        : (totalNonCashAmountCounter[trips.driverID] = resolvedBills);
    }
  }
  // Saving answers inan array
  let noOfCashTrips = Object.values(cashTripCounter);
  let noOfnonCashTrips = Object.values(nonCashTripCounter);
  let totalAmountEarned = Object.values(totalAmountEarnedCounter);
  let totalCashAmount = Object.values(totalCashAmountCounter);
  let totalNonCashAmount = Object.values(totalNonCashAmountCounter);
  let infoPerTripKeys = Object.values(infoPerTrip);

  return {
    noOfCashTrips: noOfCashTrips,
    noOfnonCashTrips: noOfnonCashTrips,
    totalAmountEarned: totalAmountEarned,
    totalCashAmount: totalCashAmount,
    totalNonCashAmount: totalNonCashAmount,
    infoPerTripKeys: infoPerTripKeys,
  };
};

module.exports = driverReport;
