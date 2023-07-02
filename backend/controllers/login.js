const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    // 401: unauthorized
    return response.status(401).json({ error: 'invalid username or password' })
  }

  // if password is correct, a token containing username and user_id is created in a digitally signed form
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  // the token is digitally signed with a string from the env variable SECRET => only parties that know SECRET can generate a valid token
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
