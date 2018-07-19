#!/usr/bin/env node

var commander = require('commander');
var http      = require('http');
var fs        = require("fs");

var accessKey = 'c8dc47fc727e256a4824b1885c7bd994';
var latestUrl = 'http://data.fixer.io/api/latest?access_key=' + accessKey;

/* only allow first argument if it is either -h or -v, or one of the 
   preset commands */
var firstArg = process.argv[2];
if (!(firstArg == 'latest' || firstArg == 'convert' || firstArg == 'seeall'
   || firstArg == '-h' || firstArg == '--help'
   || firstArg == '-v' || firstArg == '--version')) {
  console.error('No valid command supplied! See help menu (\'currency -h\')');
  process.exit(1);
}
 
/* Each command-line command is set up individually (using 
   the Commander API). The help manual (accessed via -h and --help) 
   is set up automatically by Commander. We use standard processing
   of command-line arguments to deal with initial errors. */

commander
  .version('currency-cli version 0.1.0', '-v, --version');

commander
  .command('seeall')
  .description('see all currencies and their 3 letter codes')
  .action(function() {
 
    http.get(latestUrl, function(res) {
      const { statusCode } = res;
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {

          var json = JSON.parse(rawData);
          console.log('List of all valid currencies: ');
          for (var key in json.rates) {
            console.log(key);
          }

        } catch (e) {
          console.error(e.message);
          process.exit(1);
        }
      });
    });

  });
  
commander
  .command('latest [currency]')
  .description('get the latest value of the currency (with respect to USD)')
  .action(function (currency) {

    if (!currency) {
      console.error("No currency supplied!");
      process.exit(1);
    }

    http.get(latestUrl, function(res) {
      const { statusCode } = res;
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {

          var json = JSON.parse(rawData);
          var isInRates = false;
          for (var key in json.rates) {
            if (key == currency) {
              isInRates = true;
            }
          }
          if (isInRates) {
            var relativeToUsd = 1 / json.rates[currency] * json.rates.USD;
            console.log(relativeToUsd);
          } else {
            console.error("Not a valid currency! Currency must be supplied in its 3 letter all-caps form e.g. USD, GBP");
            process.exit(1);
          }

        } catch (e) {
          console.error(e.message);
          process.exit(1);
        }
      });
    });

  });

commander
  .command('convert [amount] [currency1] [currency2]')
  .description('convert amount of currency1 to currency2')
  .action(function (amount, currency1, currency2) {

    if (!amount || !currency1 || !currency2) {
      console.error("Two currencies and an amount not supplied!");
      process.exit(1);
    }

    if (typeof amount != "number") {
      console.error("'amount' must be a number!");
      process.exit(1);
    }

    // TODO: check input currencies belong to list of valid currencies

    /* 'convert' endpoint type is not available for free, so we calculate 
       conversion with the 'latest' endpoint */
    var json = getJsonFromUrl(latestUrl);

    console.log(currency1);
    console.log(currency2);

  });

commander
  .parse(process.argv);
