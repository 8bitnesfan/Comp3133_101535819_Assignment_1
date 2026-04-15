const express = require("express");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();
const connectDB = require("./config/db");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

connectDB();

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    server.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
    });
}

startServer();