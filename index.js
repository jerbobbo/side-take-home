const express = require('express');
const morgan = require('morgan');
const app = express();
const { ApolloServer,  } = require('apollo-server-express');
const typeDefs = require('./types');
const { SimplyRetsAPI } = require('./stores/simplyrets/simply-rets-api');
const resolvers = require('./resolvers');
const config = require('config');

(async () => {
    const isDevelopment = config.get('env') === 'development';

    app.use(morgan('combined'));
    const server = new ApolloServer({
     typeDefs,
     resolvers,
     dataSources: () => ({
        simplyRetsApi: new SimplyRetsAPI()
     }),
     plugins: [
        {
            requestDidStart: ( requestContext ) => {
                const query = requestContext.request.query.replace( /\s+/g, ' ' ).trim();
                const variables = JSON.stringify( requestContext.request.variables );
                console.log( new Date().toISOString(), `- [Request Started] { query: ${ query }, variables: ${ variables }, operationName: ${ requestContext.request.operationName } }` );
            }
         }
     ],
     playground: isDevelopment,
     debug: isDevelopment,
     introspection: true
    });
    
    try {
        await server.start();
        server.applyMiddleware({ app, path:"/graphql" });
    } catch (error) {
        console.error(error);
    }


    const port = config.get('server.port');
    app.listen({ port }, () =>
        console.log(`Listening on http://localhost:${port}/graphql`)
    );
})()