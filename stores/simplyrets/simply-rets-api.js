const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('config');
const { getHeaders } = require('./auth');

class SimplyRetsAPI extends RESTDataSource {
  constructor() {
    super();
  }
  
  async getListings(city) {
    try {
      const path = config.get('simplyRets.url');
      const queryParams = new URLSearchParams({ cities: city });
      console.log('Simply Rets request', { path, queryParams });
      const response = await this.get(path, queryParams);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  willSendRequest(request) {
    request.headers = getHeaders();
  }
}

module.exports = {
  SimplyRetsAPI
}