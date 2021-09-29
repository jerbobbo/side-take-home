module.exports = {
  Query: {
    properties: async (parent, { city }, { dataSources }) => {
      return dataSources.simplyRetsApi.getListings(city);
    }
  }
};