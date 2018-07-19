# Currency Command Line Interface

A command line tool for manipulating currency data. Receives currency data using [Fixer](fixer.io) API.

## Usage

All currencies must be input as their 3 letter code (e.g. USD, GBP).

`currency seeall` - see all available currencies and their 3 letter codes.

`currency latest [currency]` - get the latest value of [currency] (with respect to USD).

`currency [amount] [currency1] [currency2]` - convert [amount] of [currency1] to [currency2].
