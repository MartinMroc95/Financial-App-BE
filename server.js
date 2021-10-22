import { ApolloServer, gql } from 'apollo-server'
import mongoose from 'mongoose'

import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers/index.js'

import CONFIG_DATA from './config.js'

const MONGO_DB = CONFIG_DATA.MONGDO_DB

const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) })

mongoose.connect(MONGO_DB, { useNewUrlParser: true }).then(async () => {
    console.log('MongoDB connected')
    const { url } = await server.listen({ port: 4000 })
    console.log(`🚀  Server ready at ${url}`)
})
