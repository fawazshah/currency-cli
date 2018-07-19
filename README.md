# Currency Command Line Interface

A command line tool for currency conversion. Receives currency data using [Fixer](fixer.io) API.

## Installation

First, make sure you have npm installed. This comes packaged with Node.js which can be downloaded at https://nodejs.org/en/.

To install globally:

```bash
sudo npm install -g currency-cli
```

## Usage

All currencies must be input as their 3 letter code (e.g. USD, GBP).

`currency seeall` - see all available currencies and their 3 letter codes.

`currency latest [currency]` - get the latest value of [currency] (with respect to USD).

`currency [amount] [currency1] [currency2]` - convert [amount] of [currency1] to [currency2].
