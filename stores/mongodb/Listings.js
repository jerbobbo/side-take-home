const { DataSource } = require('apollo-datasource');

class Listings extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  async findOrCreateListingById(listingId) {
    let listing = await this.store.find({ listingId }).toArray();
    if (listing.length) {
      return listing[0];
    }
    listing = await this.store.insertOne({ listingId, favoriteCount: 0 });
    return listing;
  }

  async addToFavoriteCount(listingId) {
    const listing = await this.findOrCreateListingById(listingId);
    await this.store.updateOne({ listingId }, { favoriteCount: listing.favoriteCount++ });
  }

  async getFavoriteCountById(listingId) {
    const listing = await this.findOrCreateListingById(listingId);
    return listing.favoriteCount;
  }
}

module.exports = {
  Listings
}
