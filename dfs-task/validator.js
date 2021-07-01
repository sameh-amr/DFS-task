//we import csv handler module
const CSVReader = require("./csvhandler");

//function that makes all the validations
exports.validateTransfers = function validateTransfers() {
  //an array containing transfers information
  var transfers = CSVReader.readInput("Transfers.csv");
  //an array containing all the accounts data
  var accountsData = CSVReader.readInput("Accounts.csv");
  //an array to store status of an operation
  var errors = [];
  //perform validation and after each validation filter array
  //1-validate accountID
  //after validation update both errors and transfers
  errors = [
    ...this.validateAccountsIDS(transfers, accountsData, errors).errors,
  ];
  transfers = [
    ...this.validateAccountsIDS(transfers, accountsData, errors).transfers,
  ];

  //2-validate the amount and balance

  errors = [...this.validateAmount(transfers, accountsData, errors).errors];
  transfers = [
    ...this.validateAmount(transfers, accountsData, errors).transfers,
  ];

  //3-validate currency match
  errors = [...this.validateCurrency(transfers, accountsData, errors).errors];
  transfers = [
    ...this.validateCurrency(transfers, accountsData, errors).transfers,
  ];

  //upon successfull validation add status successfull to the array
  transfers.forEach(function (element) {
    element.status = "Successfull";
    element.Error = "";
  });

  return [...transfers, ...errors];
};

//make sure that the accounts exists
exports.validateAccountsIDS = function validateAccountsIDS(
  transfers,
  accountsdata,
  errors
) {
  //make a temporary array for storing all operations
  var temp = [...transfers];

  //loop on the transfers from and to and make sure that these IDS Exist
  temp.forEach((element) => {
    //make sure that the from account exists
    let from = accountsdata.find((o) => o.ID === element.from);
    //make sure that the to account exists
    let to = accountsdata.find((o) => o.ID === element.to);
    //if one of them gives an undefined object return error array after filling it (account doesnt exist) and remove it  from the original array
    if (!from || !to) {
      errors.push({
        ...element,
        status: "Failed",
        Error: "One Of The accounts doesnt exists...",
      });
      transfers.splice(element, 1);
    }
  });
  //for test purposes
  transfers.forEach(function (element) {
    element.status = "Successfull";
    element.Error = "";
  });
  return { transfers: [...transfers], errors: [...errors] };
};

//make sure that the balance is more than or equal amount transfered
exports.validateAmount = function validateAmount(
  transfers,
  accountsdata,
  errors
) {
  //make a temporary array for storing all operations
  var temp = [...transfers];
  //loop on the transfers from account and make sure there is enough funds
  temp.forEach((element) => {
    let from = accountsdata.find((o) => o.ID === element.from);
    //if the balance has insufficent funds push an error to the array and remove it  from the original array
    if (parseInt(from.Balance) < parseInt(element.amount)) {
      errors.push({
        ...element,
        status: "Failed",
        Error: "Insufficient funds",
      });
      transfers.splice(element, 1);
    }
  });
  //for test purposes
  transfers.forEach(function (element) {
    element.status = "Successfull";
    element.Error = "";
  });

  return { transfers: [...transfers], errors: [...errors] };
};

//make sure that the balance is more than or equal amount transfered
exports.validateCurrency = function validateCurrency(
  transfers,
  accountsdata,
  errors
) {
  //make a temporary array for storing all operations
  var temp = [...transfers];
  temp.forEach((element) => {
    //return from account exists
    let from = accountsdata.find((o) => o.ID === element.from);
    //return to account
    let to = accountsdata.find((o) => o.ID === element.to);
    //check for currency miss match if exist remove it from the original array
    if (from.Currency.localeCompare(to.Currency) != 0) {
      errors.push({
        ...element,
        status: "Failed",
        Error: "Currency Miss Match",
      });
      transfers.splice(element, 1);
    }
  });
  //for test purposes
  transfers.forEach(function (element) {
    element.status = "Successfull";
    element.Error = "";
  });
  return { transfers: [...transfers], errors: [...errors] };
};
