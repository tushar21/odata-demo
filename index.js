var http = require ('http');
var Datastore = require ('nedb');
var MongoClient = require ('mongodb').MongoClient;
var db = new Datastore ({inMemoryOnly: true});
var ODataServer = require ('simple-odata-server');
var Adapter = require ('simple-odata-server-mongodb');
const express = require ('express');
const app = express ();

var model = {
  namespace: 'testmongo8866',
  entityTypes: {
    Product: {
      _id: {type: 'Edm.String', key: true},
      ProductNum: {type: 'Edm.Int32'},
      Name: {type: 'Edm.String'},
      Description: {type: 'Edm.String'},
      ReleaseDate: {type: 'Edm.DateTime'},
      DiscontinuedDate: {type: 'Edm.DateTime'},
      Rating: {type: 'Edm.Int32'},
      Price: {type: 'Edm.Double'},
    },
  },
  entitySets: {
    products: {
      entityType: 'testmongo8866.Product',
    },
  },
};

var odataServer = ODataServer ('http://localhost:3000').model (model);
odataServer.cors ('*');
MongoClient.connect (
  'mongodb://tushar21:tushar21@ds141661.mlab.com:41661/testmongo8866',
  function (err, db) {
    console.log (err, 'Error in connceting db');
    odataServer.adapter (
      Adapter (function (cb) {
        cb (err, db.db ('testmongo8866'));
      })
    );
  }
);

app.listen (3010, function () {
  console.log ('Server running at http://127.0.0.1:3010/');
});

app.use ('/', function (req, res) {
  odataServer.handle (req, res);
});

// http.createServer (odataServer.handle.bind (odataServer)).listen (3010);
