import AuthenticationError from 'apollo-server'
import jwt from 'jsonwebtoken'

import CONFIG_DATA from '../config.js'

const SECRET_KEY = CONFIG_DATA.SECRET_KEY

export default (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization

    if (authHeader) {
        // Bearer ....
        const token = authHeader.split('Bearer ')[1]

        console.log('token', token)
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY)
                return user
            } catch (error) {
                throw new Error('Invalid/Expired token')
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]")
    }
    throw new Error('Authorization header must be provided')
}
