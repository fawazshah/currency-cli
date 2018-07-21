#!/usr/bin/env node

const commander = require('commander');
const fetch     = require('node-fetch');

/* Our latestUrl variable will give us access to the 'latest' endpoint,
   containing the latest currency values. The other endpoint available for 
   free is the 'historical' endpoint, showing currency data at a specific
   date. */

const accessKey = 'c8dc47fc727e256a4824b1885c7bd994';
const latestUrl = 'http://data.fixer.io/api/latest?access_key=' + accessKey;

/* only allow first argument if it is either -h or -v, or one of the preset 
   commands */

const firstArg = process.argv[2];
if (!(firstArg == 'latest' || firstArg == 'convert' || firstArg == 'seeall'
   || firstArg == 'historical' || firstArg == 'historicalconvert'
   || firstArg == '-h' || firstArg == '--help'
   || firstArg == '-v' || firstArg == '--version')) {
  console.error('No valid command supplied! See help menu (\'currency -h\')');
  process.exit(1);
}
 
/* Each command-line command is set up individually (using the Commander API).
   The help manual (accessed via -h and --help) is set up automatically by 
   Commander. We use standard processing of command-line arguments to deal 
   with initial errors. */

commander
  .version('currency-cli version 0.1.0', '-v, --version');

commander.on('--help', function(){
  console.log('');
  console.log('  Note:');
  console.log('');
  console.log('    All currencies must be given as their 3 letter codes.');
  console.log('    All dates must be given in the form \'YYYY-MM-DD\'.');
  console.log('');
});

commander
  .command('seeall')
  .description('see all currencies and their 3 letter codes')
  .action(function() {

    /* We use node-fetch, a Node.js module that uses the JavaScript Fetch API,
       to access JSON data from the given fixer.io URL. We want the latest 
       currency values, so we fetch from latestUrl. */
 
    fetch(latestUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.success == false) {
          console.error(json.error);
          process.exit(1);
        }
        console.log('List of all valid currencies: ');
        for (var key in json.rates) {
          console.log(key);
        }
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

    /* Again, we want the latest currency values, so we use latestUrl. */

    fetch(latestUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.success == false) {
          console.error(json.error);
          process.exit(1);
        }
        var currencyIsInRates = false;
        for (var key in json.rates) {
          if (key == currency) {
            currencyIsInRates = true;
          }
        }
        if (currencyIsInRates) {
          const relativeToUsd = 1 / json.rates[currency] * json.rates.USD;
          console.log(relativeToUsd);
        } else {
          console.error("Not a valid currency! Currency must be supplied in its 3 letter all-caps form (e.g. USD, GBP)");
          process.exit(1);
        }
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

    if (isNaN(parseInt(amount))) {
      console.error("'amount' must be a number!");
      process.exit(1);
    }

    /* 'convert' endpoint type is not available for free, so we calculate 
       conversion with the 'latest' endpoint (i.e. latestUrl). */

    fetch(latestUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.success == false) {
          console.error(json.error);
          process.exit(1);
        }
        var currency1IsInRates = false, currency2IsInRates = false;
        for (var key in json.rates) {
          if (key == currency1) {
            currency1IsInRates = true;
          }
          if (key == currency2) {
            currency2IsInRates = true;
          }
        }
        if (currency1IsInRates && currency2IsInRates) {
          const ratio = amount / json.rates[currency1] * json.rates[currency2];
          console.log(ratio);
        } else {
          console.error("Not a valid currency! Currency must be supplied in its 3 letter all-caps form (e.g. USD, GBP)");
          process.exit(1);
        }
      });

  });

commander
  .command('historical [date] [currency]')
  .description('get the value of the currency (with respect to USD) at a particular date') 
  .action(function(date, currency) {

    if (!date || !currency) {
      console.error('A date and a currency not supplied!');
      process.exit(1);
    }

    /* checking the date is in the correct format */

    var dateAsList = date.split('-');
    if (!(dateAsList.length == 3 &&
          dateAsList[0].length == 4 &&
          dateAsList[1].length == 2 &&
          dateAsList[2].length == 2 &&
          !isNaN(parseInt(dateAsList[0])) &&
          !isNaN(parseInt(dateAsList[1])) &&
          !isNaN(parseInt(dateAsList[2])))) {
      console.error('Not a valid date!');
      process.exit(1);
    }

    /* This command uses the 'historical' endpoint, so we create our historicalUrl. */

    const historicalUrl = 'http://data.fixer.io/api/' + date + '?access_key=' + accessKey;

    fetch(historicalUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.success == false) {
          console.error(json.error);
          process.exit(1);
        }
        var currencyIsInRates = false;
        for (var key in json.rates) {
          if (key == currency) {
            currencyIsInRates = true;
          }
        }
        if (currencyIsInRates) {
          const relativeToUsd = 1 / json.rates[currency] * json.rates.USD;
          console.log(relativeToUsd);
        } else {
          console.error("Not a valid currency! Currency must be supplied in its 3 letter all-caps form (e.g. USD, GBP)");
          process.exit(1);
        }
      });

    });

commander
  .command('historicalconvert [date] [amount] [currency1] [currency2]')
  .description('converts amount of currency1 into currency2, using currency values at a particular date')
  .action(function(date, amount, currency1, currency2) {

    if (!date || !amount || !currency1 || !currency2) {
      console.error('Two currencies, a date and an amount not supplied!');
      process.exit(1);
    }

    if (isNaN(parseInt(amount))) {
      console.error("'amount' must be a number!");
      process.exit(1);
    }

    /* checking the date is in the correct format */

    var dateAsList = date.split('-');
    if (!(dateAsList.length == 3 &&
          dateAsList[0].length == 4 &&
          dateAsList[1].length == 2 &&
          dateAsList[2].length == 2 &&
          !isNaN(parseInt(dateAsList[0])) &&
          !isNaN(parseInt(dateAsList[1])) &&
          !isNaN(parseInt(dateAsList[2])))) {
      console.error('Not a valid date!');
      process.exit(1);
    }

    /* This command uses the 'historical' endpoint, so we create our historicalUrl. */

    const historicalUrl = 'http://data.fixer.io/api/' + date + '?access_key=' + accessKey;

    fetch(historicalUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.success == false) {
          console.error(json.error);
          process.exit(1);
        }
        var currency1IsInRates = false, currency2IsInRates = false;
        for (var key in json.rates) {
          if (key == currency1) {
            currency1IsInRates = true;
          }
          if (key == currency2) {
            currency2IsInRates = true;
          }
        }
        if (currency1IsInRates && currency2IsInRates) {
          const ratio = amount / json.rates[currency1] * json.rates[currency2];
          console.log(ratio);
        } else {
          console.error("Not a valid currency! Currency must be supplied in its 3 letter all-caps form (e.g. USD, GBP)");
          process.exit(1);
        }
      });

    });

commander
  .parse(process.argv);
