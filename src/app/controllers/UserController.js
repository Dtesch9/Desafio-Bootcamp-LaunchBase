const User = require('../models/User')

const crypto = require('crypto')

module.exports = {
  register(req, res) {
    return res.render('admin/users/register')
  },
  async post(req, res) {
    try {
      const { user } = req

      const { name, email, is_admin } = user

      const userId = await User.create({
        name,
        email,
        password: crypto.randomBytes(2).toString('hex'),
        is_admin
      })

      return res.send({ user, userId })
    } catch (error) {
      console.error(error)
    }
  }
}