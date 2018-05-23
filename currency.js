#!/usr/bin/env node

var args = process.argv.slice(2);
var http = require('http');
var access_key = 'c8dc47fc727e256a4824b1885c7bd994';
var error = 'Error';

if (args.length != 0) {
  switch (args[0]) {

    case ('-l'):
    case ('--latest'):
      console.log('print latest value');
      break;

    case ('-c'):
    case ('--convert'):
      console.log('print converted values');
      break;

  }
} else {
  console.log(error);
}

var latest_url = 'http://data.fixer.io/api/latest?access_key=' + access_key;

/*
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
