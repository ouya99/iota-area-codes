# IOTA Area Codes (IAC)

IACs are a method for tagging IOTA transactions with a geo-location, which allows them to be fetched based on their location. IACs are currently based on [Open Location Codes](https://en.wikipedia.org/wiki/Open_Location_Code), also known as Plus codes, which were created by Google Zurich in 2014. For a more detailed explanation of IACs, please read [./docs/iota-area-codes.md](./docs/iota-area-codes.md)

This package contains a JavaScript implementation of IOTA Area Codes (IAC) as proposed [here](https://github.com/iota-community/iota-area-codes) by Lewis Freiberg.

## Installing

Install this package using the following commands:

```shell
npm install @iota/area-codes
```

or

```shell
yarn add @iota/area-codes
```

## Example Usage

```js
const iotaAreaCodes = require('@iota/area-codes');

const iac = iotaAreaCodes.encode(52.529562, 13.413047);
console.log("IOTA Area Code", iac);

const iacHighPrecision = iotaAreaCodes.encode(52.529562, 13.413047, iotaAreaCodes.CodePrecision.EXTRA);
console.log("IOTA Area Code High Precision", iacHighPrecision);

const codeArea = iotaAreaCodes.decode('NPHTQORL9XKP');
console.log("IOTA Code Area", codeArea);

const olc = iotaAreaCodes.toOpenLocationCode('NPHTQORL9XKP');
console.log("Open Location Code", olc);

const iac2 = iotaAreaCodes.fromOpenLocationCode('X4HM+MM');
console.log("IOTA Area Code", iac2);

const isValid1 = iotaAreaCodes.isValid('JAHAS0');
console.log("isValid1", isValid1);

const isValid2 = iotaAreaCodes.isValid('NPHTQORL9XKP');
console.log("isValid2", isValid2);

const extracted = iotaAreaCodes.extract('NPHTQORL9XKP999999999');
console.log("extracted", extracted);
```

Will output:

```shell
IOTA Area Code NPHTQORL9XK
IOTA Area Code High Precision NPHTQORL9XKP
IOTA Code Area { latitude: 52.52956250000001,
  longitude: 13.413046874999981,
  codePrecision: 11,
  latitudeLow: 52.529550000000015,
  latitudeHigh: 52.529575000000015,
  longitudeLow: 13.413031249999982,
  longitudeHigh: 13.413062499999983 }
Open Location Code 9F4MGCH7+R6F
IOTA Area Code ZHRT9TT
isValid1 false
isValid2 true
extracted NPHTQORL9XKP
```

## API Reference

See the API reference for the Javascript implementation [here](./docs/api.md).

## Examples

To see the IACs in actions a demonstration application using this library can be found in the [./examples/](./examples/README.md) folder. This example is deployed to <https://iota-poc-area-codes.dag.sh> if you'd like to simply test it. 

## License 

MIT License - Copyright (c) 2019 IOTA Stiftung



