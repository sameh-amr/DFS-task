//import validator
const validator = require("../validator");

//unit testing for validators

//first function is validateIDS

describe("validateIDS", () => {
  it("Make Sure that the IDS are valid and no ID is false in the csv", () => {
    //three arrays to be passed to our validate account functions
    var transfers = [
      { from: "3", to: "1", amount: "10", currency: "euro" },
      { from: "1", to: "2", amount: "10", currency: "euro" },
    ];

    var accounts = [
      { ID: "1", Balance: "10", Currency: "euro" },
      { ID: "2", Balance: "10", Currency: "euro" },
    ];

    var errors = [];

    //expected result is the result that we expect after operation ends
    var expectedResults = [
      {
        from: "1",
        to: "2",
        amount: "10",
        currency: "euro",
        status: "Successfull",
        Error: "",
      },
      {
        from: "3",
        to: "1",
        amount: "10",
        currency: "euro",
        status: "Failed",
        Error: "One Of The accounts doesnt exists...",
      },
    ];

    //the results from the function calls
    var results = [
      ...validator.validateAccountsIDS(transfers, accounts, errors).transfers,
      ...validator.validateAccountsIDS(transfers, accounts, errors).errors,
    ];

    //we are expecting the results array returned from the call to be equal to the expected array
    expect(results).toEqual(expect.arrayContaining(expectedResults));
  });
});

//second function is validate Amount

describe("validateAmount", () => {
  it("Make Sure that the sending Account has a balance more than the money to be transfered", () => {
    //three arrays to be passed to our validate account functions
    var transfers = [
      { from: "1", to: "2", amount: "100", currency: "euro" },
      { from: "1", to: "2", amount: "10", currency: "euro" },
    ];

    var accounts = [
      { ID: "1", Balance: "10", Currency: "euro" },
      { ID: "2", Balance: "10", Currency: "euro" },
    ];

    var errors = [];

    //expected result is the result that we expect after operation ends
    var expectedResults = [
      {
        from: "1",
        to: "2",
        amount: "100",
        currency: "euro",
        status: "Failed",
        Error: "Insufficient funds",
      },
      {
        from: "1",
        to: "2",
        amount: "10",
        currency: "euro",
        status: "Successfull",
        Error: "",
      },
    ];

    //the results from the function calls
    var results = [
      ...validator.validateAmount(transfers, accounts, errors).transfers,
      ...validator.validateAmount(transfers, accounts, errors).errors,
    ];

    //we are expecting the results array returned from the call to be equal to the expected array
    expect(results).toEqual(expect.arrayContaining(expectedResults));
  });
});

describe("validateCurrency", () => {
  it("Make Sure that the both sending Account and recieving Account has the same currency", () => {
    //three arrays to be passed to our validate account functions
    var transfers = [
      { from: "1", to: "2", amount: "10", currency: "usd" },
      { from: "1", to: "3", amount: "10", currency: "usd" },
    ];

    var accounts = [
      { ID: "1", Balance: "10", Currency: "usd" },
      { ID: "2", Balance: "10", Currency: "euro" },
      { ID: "3", Balance: "10", Currency: "usd" },
    ];

    var errors = [];

    //expected result is the result that we expect after operation ends
    var expectedResults = [
      {
        from: "1",
        to: "2",
        amount: "10",
        currency: "usd",
        status: "Failed",
        Error: "Currency Miss Match",
      },
      {
        from: "1",
        to: "3",
        amount: "10",
        currency: "usd",
        status: "Successfull",
        Error: "",
      },
    ];

    //the results from the function calls
    var results = [
      ...validator.validateCurrency(transfers, accounts, errors).transfers,
      ...validator.validateCurrency(transfers, accounts, errors).errors,
    ];

    //we are expecting the results array returned from the call to be equal to the expected array
    expect(results).toEqual(expect.arrayContaining(expectedResults));
  });
});
