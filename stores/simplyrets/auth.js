const config = require('config');

const getHeaders = () => {
  const user = config.get('simplyRets.user');
  const password = config.get('simplyRets.password');
  const passwordBuffer = Buffer.from(`${user}:${password}`, 'utf-8');
  const base64password = passwordBuffer.toString('base64');

  const headers = {
    Authorization: `Basic ${base64password}`
  }
  return headers;
};

module.exports = {
  getHeaders
};
