const bcrypt = require('bcrypt')
const db = require('../db')
const {BCRYPT_WORK_FACTOR} = require('../config')
const {BadRequestError, UnauthorizedError} = require('../utils/errors')

class User
{
    static async makePublicUser(user)
    {
        return{
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            location: user.location,
            date: user.date
        }
    }

    static async login(credentials)
    {
        //User shpuld be able to submit email and password
        //If it's missing, throw an error
        //Look up the user in the db by email
        //If found, compare the password with the DB password and if matched, return user
        //If wrong, throw an error

        const requiredFields = ["email", "password"]
        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field))
            {
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        })

        const user = await User.fetchUserByEmail(credentials.email)
        if(user)
        {
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if(isValid)
            {
                return User.makePublicUser(user)
            }
        }

        throw new UnauthorizedError("Invalid email/password")
    }

    static async register(credentials)
    {
        //User submits email and password and resvp status
        //If missing, throw error
        //Make sure no user already exists with the email
        //If so, throw an error
        //If not, take the user's password and hash it
        //Take email and lowercase it and create new user in DB
        //return user

        const requiredFields = ["email", "password", "firstName", "lastName", "location", "date"]
        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field))
            {
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        })

        if(credentials.email.indexOf('@') <= 0)
        {
            throw new BadRequestError("Invalid email")
        }

        //Does email exist?
        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser)
        {
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)

        const lowercasedEmail = credentials.email.toLowerCase()
        const result = await db.query(`
            INSERT INTO users (
                email,
                password,
                first_name,
                last_name,
                location,
                date
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, password, first_name, last_name, email, location, date;

        `, [lowercasedEmail, hashedPassword, credentials.firstName, credentials.lastName, credentials.location, credentials.date])

        //RETURN THE USER
        const user = result.rows[0]
        return User.makePublicUser(user)
    }

    static async fetchUserByEmail(email)
    {
        if(!email)
        {
            throw new BadRequestError("No email provided.")
        }

        const query = `SELECT * FROM users WHERE email = $1`
        const result = await db.query(query, [email.toLowerCase()])
        const user = result.rows[0]
        return user
    }
}

module.exports = User