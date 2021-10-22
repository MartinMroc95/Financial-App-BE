import { AuthenticationError } from 'apollo-server'

import Post from '../../models/Post.js'
import checkAuth from '../../util/check-auth.js'

const postResolvers = {
    Query: {
        async getPosts() {
            try {
                return await Post.find({}).sort({ createdAt: -1 })
            } catch (error) {
                throw new Error(error)
            }
        },
        async getPost(_, { postId }) {
            try {
                console.log('postId', postId)
                const post = await Post.findOne({ _id: postId })
                console.log('post', post)
                if (!post) {
                    throw new Error('Post not found')
                }

                return post
            } catch (error) {
                throw new Error(error)
            }
        },
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context)
            console.log('user', user)

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            })

            const post = await newPost.save()

            return post
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context)

            try {
                const post = await Post.findById(postId)

                if (user.username === post.username) {
                    await post.delete()

                    return 'Post deleted successfully'
                } else {
                    throw new Error('Action not allowed')
                }
            } catch (error) {
                throw new Error(error)
            }
        },
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
        },
    },
}

export default postResolvers
