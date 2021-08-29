const calculateTrips = (getTrip) => {
    let cashTrips = 0;
    let nonCashTrips = 0;
    let billedTotal = 0;
    let cashBilledTotal = 0;
    let nonCashBilledTotal = 0;
    let amountEarnedByDriver = {};
    // looping through the getTrips data
    for (let trips of getTrip) {
      //removing the commas and convert bill amount to integer
      let resolvedBills = Number(
        trips.billedAmount.toString().split(",").join("")
      );
      if (trips.billedAmount) {
        //  getting the bill total
        billedTotal += resolvedBills;
        // creating an object counter for driver Earnings
        amountEarnedByDriver[trips.driverID]
          ? (amountEarnedByDriver[trips.driverID] += resolvedBills)
          : (amountEarnedByDriver[trips.driverID] = resolvedBills);
      }
      if (trips.isCash == true) {
        // counting trips of CashTrip and getting the total amount
        cashTrips += 1;
        cashBilledTotal += resolvedBills;
      } else if (trips.isCash == false) {
        // counting trips of NonCashTrip and getting the total amount
        nonCashTrips += 1;
        nonCashBilledTotal += resolvedBills;
      }
    }
    return {
      cashTrips: cashTrips,
      nonCashTrips: nonCashTrips,
      billedTotal: billedTotal,
      cashBilledTotal: cashBilledTotal,
      nonCashBilledTotal: nonCashBilledTotal,
      amountEarnedByDriver: amountEarnedByDriver,
    };
  };

  module.exports= { calculateTrips }