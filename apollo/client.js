const { ApolloClient } = require('apollo-client');
const config = require('config');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');
const { authLink } = require('./auth');

let client;

const initApolloClient = () => {
  const uri = config.get('simplyRets.url');
  const httpLink = createHttpLink({ uri, fetch });
  const cache = new InMemoryCache();

  client = new ApolloClient({ 
    link: authLink.concat(httpLink),
    cache
   });
};

module.exports = {
  initApolloClient,
  client
}
