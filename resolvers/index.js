module.exports = {
  Query: {
    properties: async (parent, { city }, { dataSources }) => {
      return dataSources.simplyRetsApi.getListings(city);
    }
  },
  Listing: {
    favoriteCount: async (parent, _, { dataSources }) => {
      return dataSources.listings.getFavoriteCountById(parent.listingId);
    }
  }
};