import postResolvers from './posts.js'
import usersResolvers from './users.js'
import commentsResolvers from './comments.js'

console.log('postResolvers', postResolvers)

const resolvers = {
    Query: {
        ...postResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolvers.Mutation,
    },
    Subscription: {
        ...postResolvers.Subscription,
    },
}

export default resolvers
