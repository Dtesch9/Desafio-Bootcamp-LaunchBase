const User = require('../models/User')

const { compare } = require('bcryptjs')

function checkAllfields(body) {
  const keys = Object.keys(body)

  for (let key of keys) {
    if (body[key] == "" && key != 'password') return true
  }
}

module.exports = {
  async index(req, res, next) {
    try {
      const { userId: id } = req.session
      
      const user = await User.findOne({ where: {id} })

      if (!user) return res.render('admin/users/register', {
        error: 'Usuário não encontrado!'
      })

      req.user = user

      next()
    } catch (error) {
      console.error(error)
      return res.render('admin/users/register', {
        error: 'Erro inesperado, tente novamente'
      })
    }
  },
  async put(req, res, next) {
    try {
      const emptyField = checkAllfields(req.body)

      if (emptyField) return res.render('admin/users/index', {
        user: req.body,
        warning: 'Por Favor, preencha todos os campos'
      })


      const { password, email } = req.body

      if (!password) return res.render('admin/users/index', {
        user: req.body,
        warning: 'Digite sua senha para alterações!'
      })

      
      const { userId: id } = req.session
      const user = await User.findOne({ where: {id} })

      if (email != user.email) {
        const emailExists = await User.findOne({ where: {email} })

        if (emailExists) return res.render('admin/users/index', {
          user: req.body,
          error: 'Email já cadastrado!'
        })
      }

      const granted = await compare(password, user.password)

      if (!granted) return res.render('admin/users/index', {
        user: req.body,
        error: 'Senha incorreta!, tente novamente'
      })

      req.user = req.body

      next()
    } catch (error) {
      console.error(error)
      return res.render('admin/users/index', {
        user: req.body,
        error: 'Erro inesperado, tente novamente'
      })
    }
  },
}
