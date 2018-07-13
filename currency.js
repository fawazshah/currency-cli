#!/usr/bin/env node

var program = require('commander');
var http = require('http');
var fs = require("fs");
fs.readFile('access_key.txt', (err, data) => {
  if (err) {
    throw err;
  } else {
    var access_key = data;
  }
});
var error = 'Error';
 
program
  .version('currency-cli version 0.1.0', '-v, --version');

program
  .command('latest [currency]')
  .description('get the latest currency value (base USD)')
  .action(function (currency) {
    console.log(currency);
  });

program
  .command('convert [currency1] [currency2]')
  .description('convert currency1 to currency2')
  .action(function (currency1, currency2) {
    console.log(currency1);
    console.log(currency2);
  });

program.parse(process.argv);
 
//if (args.length != 0) {
//  switch (args[0]) {
//
//    case ('-l'):
//    case ('--latest'):
//      console.log('print latest value');
//      break;
//
//    case ('-c'):
//    case ('--convert'):
//      console.log('print converted values');
//      break;
//
//  }
//} else {
//  console.log(error);
//}

/*
var latest_url = 'http://data.fixer.io/api/latest?access_key=' + access_key;

http.get(latest_url, function(res) {
  const { statusCode } = res;
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
});
*/
