const { ApolloServer } = require('apollo-server-express');
const { Listings } = require('../stores/mongodb/Listings');
const { getListingsCollection } = require('../stores/mongodb/store');
const { SimplyRetsAPI } = require('../stores/simplyrets/simply-rets-api');
const typeDefs = require('../types');
const resolvers = require('../resolvers');
const { getListingsMock } = require('./resources/simplyRetsMocks');
const { findOrCreateMock, addToFavoriteCountMock } = require('./resources/listingsMocks');
const { getListingsQuery, markAsFavoriteMutation } = require('./resources/queries');

describe('Test Apollo Server', () => {
  let simplyRetsApi;
  let listings;
  let server;

  beforeEach(() => {
    simplyRetsApi = new SimplyRetsAPI();
    listings = new Listings({ store: getListingsCollection() });

    // create test server using our typeDefs, resolvers, dataSources
    server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        simplyRetsApi,
        listings,
      }),
    });
  });
  
  it('Gets listings by city', async () => {
    // mock the dataSource's underlying find methods
    const getListingsSpy = jest
      .spyOn(simplyRetsApi, 'getListings')
      .mockResolvedValue([getListingsMock]);

    const findOrCreateListingSpy = jest
      .spyOn(listings, 'findOrCreateListingById')
      .mockResolvedValue(findOrCreateMock);

    // run query against the server and snapshot the output
    const res = await server.executeOperation({
      query: getListingsQuery,
    });

    expect(getListingsSpy).toBeCalledWith('Houston');
    const expectedListingId = getListingsMock.listingId;
    expect(findOrCreateListingSpy).toBeCalledWith(expectedListingId);
    expect(res).toMatchSnapshot();
  });

  it('Increments favorite count with markAsFavorite mutation', async () => {

    // mock the addToFavoriteCount method
    const addToFavoriteCountSpy = jest
      .spyOn(listings, 'addToFavoriteCount')
      .mockResolvedValue(addToFavoriteCountMock);

    // run query against the server and snapshot the output
    const res = await server.executeOperation({
      query: markAsFavoriteMutation,
    });

    expect(addToFavoriteCountSpy).toBeCalledWith('49699701');
    expect(res).toMatchSnapshot();
  });

});
