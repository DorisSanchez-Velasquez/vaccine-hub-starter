const express = require('express')
const router = express.Router()


router.post("/login", async (req,res,next) => {
    try
    {
        //Take user's email and password and authenticate them

    }
    catch(error)
    {
        next(error)
    }
})

router.post("/register", async (req,res,next) => {
    try
    {
        //Taking user, password, and number of guests and create new user in DB
    }
    catch(error)
    {
        next(error)
    }
})


module.exports = router