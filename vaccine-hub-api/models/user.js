const { notify } = require('../routes/auth')
const {UnauthorizedError} = require('../utils/errors')

class User
{
    static async login(credentials)
    {
        //User shpuld be able to submit email and password
        //If it's missing, throw an error
        //Look up the user in the db by email
        //If found, compare the password with the DB password and if matched, return user
        //If wrong, throw an error
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
    }
}

module.exports = User