# GraphQL Listings Server

## Implementation Overview

### Data Sources
The `SimplyRets API` integration and the MongoDb `Listings` Collection are both setup as `DataSource` subclasses. These subclasses encapsulate the data retrieval from both the REST API and the MongoDb collection. The data source class methods are called in my `Resolvers` like so:

```js
Query: {
    properties: async (_, { city }, { dataSources }) => {
      return dataSources.simplyRetsApi.getListings(city);
    }
  }
  ```

The `Authorization` header for the SimplyRets API calls is set by the `willSendRequest()`
method. As we move to staging and production environments with a more sophisticated authorization scheme, the header generation could take place in this method.

### Bearer Authentication
The GraphQL endpoints are protected by Bearer HTTP Authentication using the `express-bearer-token` module. The `bearer-auth` middleware function is loaded before the Apollo Server middleware is applied, allowing for authorization of the requests prior to hitting the GraphQL endpoint. The authorization check makes use of the exported `usersCollection` from `mongodb/store.js` to verify the bearer token.


### Configuration
I have setup configuration files using `node-config` that could be added to for testing, staging, production environments as needed. More sensitive authentication keys could be set using environment variables and pulled in by `node-config` by adding a `config/custom-environment-variables.yml` file.

### Tests
I have setup basic tests of the `Query` and `Mutation` requests using the `executeOperation` method, which allows for running the requests through the request pipeline. I have mocked the relevant Data Source methods so that the requests can be handled by the Resolver chain appropriately.

### Notes
Lastly, I will say this is my first time setting up a GraphQL Server and I thoroughly enjoyed doing it. I look forward to working with GraphQL more in the near future.