module.exports = {
  Query: {
    properties: async (_, { city }, { dataSources }) => {
      return dataSources.simplyRetsApi.getListings(city);
    }
  },
  Listing: {
    favoriteCount: async (parent, _, { dataSources }) => {
      return dataSources.listings.getFavoriteCountById(parent.listingId);
    }
  },
  Mutation: {
    markAsFavorite: async (_, { listingId }, { dataSources }) => {
      const updatedListing = await dataSources.listings.addToFavoriteCount(listingId);
      return { 
        message: `Listing ${listingId} successfully marked as favorite.`,
        favoriteCount: updatedListing.favoriteCount 
      };
    }
  }
};