const config = require('config');
const { setContext } = require('apollo-link-context');

const getHeaders = () => {
  const user = config.get('simplyRets.user');
  const password = config.get('simplyRets.password');
  const hashedPassword = Buffer.from(`${user}:${password}`, 'utf-8');

  const headers = {
    Authorization: `Basic ${hashedPassword}`
  }
  return headers;
};

const authLink = setContext((request, previousContext) => {
  const authHeaders = getHeaders();
  // return auth headers to the context so httpLink can read them
  return {
    headers: authHeaders
  };
});

module.exports = {
  authLink
};
