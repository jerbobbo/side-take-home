const { MongoClient } = require('mongodb');
const config = require('config');

let db;
let listingsCollection;
let usersCollection;
let client;

const connectDb = async function() {
  const uri = config.get('mongodb.uri');
  const name = config.get('mongodb.name');
  try {
    client = await MongoClient.connect(uri);
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
const closeDb = function() {
  console.log('Closing MongoDb connection.')
  client.close()
}

module.exports = {
  closeDb,
  connectDb,
  getListingsCollection,
  getUsersCollection
};
