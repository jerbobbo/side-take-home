const { MongoClient } = require('mongodb');
const config = require('config');

let db;
let listingsCollection;
let usersCollection;

const connectDb = async function() {
  const uri = config.get('mongodb.uri');
  const name = config.get('mongodb.name');
  try {
    const client = await MongoClient.connect(uri);
    console.log(`Mongo database '${name}' connected at ${uri}`);
    db = client.db(name);
    listingsCollection = db.collection('listings');
    usersCollection = db.collection('users');
  } catch (err) {
    throw new Error(`Error connecting to mongo database at ${uri}.`);
  }
}

const getListingsCollection = function() {
  return listingsCollection;
}
const getUsersCollection = function() {
  return usersCollection;
}

module.exports = {
  db,
  connectDb,
  getListingsCollection,
  getUsersCollection
};
