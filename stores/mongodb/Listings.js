const { DataSource } = require('apollo-datasource');

class Listings extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  async findOrCreateListingById(listingId) {
    try {
      const foundListing = await this.store.findOne({ listingId });
      if (foundListing) {
        console.log('foundListing', foundListing);
        return foundListing;
      }
      await this.store.insertOne({ listingId, favoriteCount: 0 });
      const newListing = await this.store.findOne({ listingId });
      return newListing;
    } catch(err) {
      console.error(err);
      throw err;
    }
  }

  async addToFavoriteCount(listingId) {
    try {
      await this.store.updateOne(
        { listingId },
        { $inc: { favoriteCount: 1 } },
        { upsert: true }
      );
      const updatedListing = await this.store.findOne({ listingId });
      return updatedListing;
    } catch(err) {
      console.error(err);
      throw err;
    }
  }

  async getFavoriteCountById(listingId) {
    try {
      const listing = await this.findOrCreateListingById(listingId);
      return listing.favoriteCount;
    } catch(err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = {
  Listings
}
