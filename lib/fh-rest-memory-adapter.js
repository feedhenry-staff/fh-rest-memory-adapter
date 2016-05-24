'use strict';

/**
 * Creates an adapter that uses process memory to store data.
 *
 * Useful for debugging and local development, but should not be used
 * in a real application since it's a volatile store and would lead to
 * data loss and inconsistency upon restarts.
 *
 * @return {Object}
 */
module.exports = function fhRestMemoryAdapter () {
  var id = 0;
  var data = {};

  var adapter = {
    create: function doCreate (params, callback) {
      id++;

      data[id] = params.data;

      callback(null, {
        uid: id.toString(),
        data: params.data
      });
    },

    read: function doRead (params, callback) {
      callback(null, data[params.id] || null);
    },

    update: function doUpadte (params, callback) {
      data[params.id] = params.data;

      callback(null, params.data);
    },

    list: function doList (params, callback) {
      callback(null, data);
    },

    delete: function doDelete (params, callback) {
      var d = data[params.id];

      if (!d) {
        callback(null, null);
      } else {
        delete data[params.id];

        callback(null, d);
      }
    }
  };

  return adapter;
};
