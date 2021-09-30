const express = require('express');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');
const config = require('config');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./types');
const { SimplyRetsAPI } = require('./stores/simplyrets/simply-rets-api');
const resolvers = require('./resolvers');
const { connectDb, getListingsCollection, closeDb } = require('./stores/mongodb/store');
const { Listings } = require('./stores/mongodb/Listings');
const bearerAuth = require('./middleware/bearer-auth');
const app = express();

(async () => {
    const isDevelopment = config.get('env') === 'development';
    try {
        await connectDb();
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                simplyRetsApi: new SimplyRetsAPI(),
                listings: new Listings({ store: getListingsCollection() })
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
            introspection: isDevelopment
        });
        
        await server.start();
        app.use(morgan('combined'));
        app.use(bearerToken());
        app.use(bearerAuth);
        server.applyMiddleware({ app, path:"/graphql" });
    } catch (error) {
        console.error(error);
    }


    const port = config.get('server.port');
    const expressServer = app.listen({ port }, () =>
        console.log(`Listening on http://localhost:${port}/graphql`)
    );
    
    const shutdown = function() {
        console.log('Received kill signal, shutting down gracefully');
        closeDb();
        expressServer.close(() => {
            console.log('Closed out remaining connections');
            process.exit(0);
        });
    }
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
})()