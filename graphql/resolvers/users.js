import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { UserInputError } from 'apollo-server-errors'

import { validateRegisterInput, validateLoginInput } from '../../util/validators.js'
import CONFIG_DATA from '../../config.js'
import User from '../../models/Users.js'

const SECRET_KEY = CONFIG_DATA.SECRET_KEY

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    )
}

const usersResolvers = {
    Mutation: {
        async login(_, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password)

            if (valid === false) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ username })

            if (user === null) {
                errors.general = 'User not found'
                throw new UserInputError('Wrong credentials', { errors })
            }

            const match = await bcrypt.compare(password, user.password)

            if (match === false) {
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token,
            }
        },
        async register(parent, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            // Validated user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)

            console.log('username', username)

            if (valid === false) {
                throw new UserInputError('Errors', { errors })
            }

            // Makes sure user does not aleready exist
            const user = await User.findOne({ username })

            console.log('user', user)

            if (user !== null) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'Username is taken.',
                    },
                })
            }
            // hash psw and create auth token
            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            })

            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token,
            }
        },
    },
}

export default usersResolvers
