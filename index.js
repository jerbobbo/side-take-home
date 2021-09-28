const express = require('express');
const { initApolloClient } = require('./apollo/client');
const app = express();
// Please use apollo server to implement your graphql query
// const { ApolloServer } = require('apollo-server-express');
// const server = new ApolloServer({
//  //...
// });
// server.applyMiddleware({ app, path:"/graphql" });

initApolloClient();

app.listen({ port: 4000 }, () =>
    console.log(`Listening on http://localhost:4000/graphql`)
);