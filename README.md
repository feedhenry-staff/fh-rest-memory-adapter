# fh-rest-memory-adapter

Creates an adapter that uses process memory to store data. Created adapters
*do not* share memory!

*IMPORTANT NOTE: This is useful for debugging and local development, but should
not be used in a real application since it's a volatile store and would lead
to data loss and inconsistency upon MBaaS Service process restarts.*

## Install

```
npm install feedhenry-staff/fh-rest-memory-adapter
```

## Usage

### Red Hat Mobile MBaaS Service
```js
'use strict';

/**
 * filename: application.js
 * The entry point of our RHAMP MBaaS Service
 */

var express = require('express')
  , mbaasApi = require('fh-mbaas-api')
  , mbaasExpress = mbaasApi.mbaasExpress()
  , app = module.exports = express()
  , log = require('fh-bunyan').getLogger(__filename);

log.info('starting application');

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// Module used to create RESTful router instances
var fhRestExpressRouter = require('fh-rest-express-router');

// Module that RESTful router will use to retrieve data
// Note: this is not yet developed
var fhRestMemoryAdapter = require('fh-rest-memory-adapter');

// Creates a handler for incoming HTTP requests that want to perform CRUDL
// operations on the "orders" dataset stored in memory
var ordersRouter = fhRestExpressRouter('orders', fhRestMemoryAdapter())

// Expose a RESTful API to orders data, e.g:
// GET /orders/12345
app.use(ordersRouter);

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;
app.listen(port, function() {
  log.info('app started on port: %s', port);
});
```

### Direct API

#### module(opts)
This module behaves as a factory function. Created adapters *do not* share
memory!

```js

var memoryAdapter = require('fh-rest-memory-adapter');

var catStore = memoryAdapter();
var dogStore = memoryAdapter();

catStore.create({
  data: {
    name: 'Felix'
  }
});

dogStore.create({
  data: {
    name: 'Fido'
  }
});

dogStore.create({
  data: {
    name: 'Max'
  }
});

dogStore.list(function (err, dogs) {
  // dogs =
  // {
  //    0: {
  //      name: 'Fido'
  //    }
  //    1: {
  //      name: 'Max'
  //    }
  // }
});

catStore.list(function (err, cats) {
  // cats =
  // {
  //    0: {
  //      name: 'Felix'
  //    }
  // }
});

```

#### adapter.create(params, callback)
Create an item in the store.

```js
store.create({
  data: {
    // Keys and values
  }
}, function (err, createdItem) {});
```

#### adapter.read(params, callback)
Read an item. _id_ must be passed in
the params.

```js
store.read({
  id: '0'
}, function (err, readItem) {});
```

#### adapter.update(params, callback)
Update an item in the store. _id_ and _data_ must be passed in the params.

```js
store.update({
  id: '0'
  data: {
    name: 'Fido',
    age: 12
  }
}, function (err, updatedItem) {});
```

#### adapter.delete(params, callback)
Delete an item in the store. _id_ must be passed in the params.

```js
store.delete({
  id: '0'
}, function (err, deletedItem) {});
```

#### adapter.list(params, callback)
List items in the store.

```js
store.list({
  // Params to use to filter, not yet supported
  query: {}
}, function (err, listedItems) {});
```
