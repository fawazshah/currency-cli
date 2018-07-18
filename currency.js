#!/usr/bin/env node

var commander = require('commander');
var http      = require('http');
var fs        = require("fs");

var access_key = 'c8dc47fc727e256a4824b1885c7bd994';
var endpointType;

/* Each command-line command is set up individually (using 
   the Commander API). The help manual (accessed via -h and --help) 
   is set up automatically by Commander. We use standard processing
   of command-line arguments to deal with initial errors. */

var firstArg = process.argv[2];
if (!(firstArg == 'latest' || firstArg == 'convert'
   || firstArg == '-h' || firstArg == '--help'
   || firstArg == '-v' || firstArg == '--version')) {
  console.log('No valid command supplied! See help menu (\'currency -h\')');
  process.exit(1);
}
 
commander
  .version('currency-cli version 0.1.0', '-v, --version');

commander
  .command('latest [currency]')
  .description('get the latest value of the currency (with respect to USD)')
  .action(function (currency) {

    if (!currency) {
      console.log("No currency supplied!");
      process.exit(1);
    }

    // TODO: check input currency belongs to list of valid currencies

    endpointType = 'latest';
    console.log(currency);
  });

commander
  .command('convert [amount] [currency1] [currency2]')
  .description('convert amount of currency1 to currency2')
  .action(function (amount, currency1, currency2) {

    if (!amount || !currency1 || !currency2) {
      console.log("Two currencies and an amount not supplied!");
      process.exit(1);
    }

    if (typeof amount != "number") {
      console.log("'amount' must be a number!");
      process.exit(1);
    }

    // TODO: check input currencies belong to list of valid currencies

    /* 'convert' endpoint type is not available for free, so we calculate 
       conversion with the 'latest' endpoint */
    endpointType = 'latest';
    console.log(currency1);
    console.log(currency2);

  });

commander
  .parse(process.argv);
 
var latest_url = 'http://data.fixer.io/api/latest?access_key=' + access_key;

http.get(latest_url, function(res) {
  const { statusCode } = res;
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {

      var parsedData = JSON.parse(rawData);
      console.log(parsedData);
      console.log(parsedData.rates.USD);

    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  });
});

var JSONObj = { "name": "hi" };
console.log(JSONObj.name);
