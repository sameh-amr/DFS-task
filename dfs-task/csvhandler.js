//a module for handling csv files
const {
  SSL_OP_SSLEAY_080_CLIENT_DH_BUG,
  SSL_OP_NO_TLSv1_1,
} = require("constants");

const csv = require("csv-parser");

//modules for writing and creating a csv file
const ObjectsToCsv = require("objects-to-csv");
const validator = require("./validator");

//a file stream module for reading and writing to files
const fs = require("fs");

//to read the input csv file with the accounts or Transfers
exports.readInput = function readInput(fileName) {
  //array containing the data for input file
  var dataRows = fs
    .readFileSync("./CSVS/" + fileName)
    .toString() // convert Buffer to string
    .split("\n"); // split string to lines

  //json objects array contain csv data in a json objects format
  var jsonObj = [];
  //headers contain the headers of csv file to be used in json objects keys
  var headers = dataRows[0].split(",");
  //loop in each row and extract values and store it in a json object
  for (var i = 1; i < dataRows.length; i++) {
    //array of data
    var data = dataRows[i].split(",");
    //an object holding the data
    var obj = {};
    for (var j = 0; j < data.length; j++) {
      //fill the json object
      obj[headers[j].trim()] = data[j].trim();
    }
    //push it in our json objects array
    jsonObj.push(obj);
  }
  //remove the last empty object from the array
  jsonObj.splice(jsonObj.length - 1, 1);
  //return csv data as an object array
  return jsonObj;
};

//write the results to csv file
exports.writeResults = async () => {
  const results = [...validator.validateTransfers()];
  console.log(results);
  const csv = new ObjectsToCsv(results);

  p = await csv
    .toDisk("./CSVS/Results.csv")
    .then(() => {
      console.log(
        "Results are ready please open the Results.csv to view it..."
      );
    })
    .catch((e) => {
      console.log(e.message);
    });
};
