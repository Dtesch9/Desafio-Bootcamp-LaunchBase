const db = require('../../config/db')

const { date } = require('../../lib/utility')

module.exports = {
  async all() {
    try {
      const results = await db.query(`SELECT * FROM chefs`)

      return results.rows
    } catch (error) {
      console.error(error)
    }
  },
  async create(data) {
    try {
      const query = `
        INSERT INTO chefs (
          name,
          avatar_url,
          created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
      `

      const values = [
        data.name,
        data.avatar_url,
        date(Date.now()).iso
      ]

      const results = await db.query(query, values)

      return results.rows[0].id
    } catch (error) {
      console.error(error)
    }
  },
  async find(id) {
    try {
      const results = 
      await db.query(`
      SELECT chefs.*, COUNT(recipes) AS total_recipes 
      FROM chefs 
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id
      `, [id])

      return results.rows[0]
    } catch (error) {
      console.error(error)
    }
  },
  update(data) {
    try {
      const query = `
      UPDATE chefs SET 
        name=($1),
        avatar_url=($2)
     WHERE id = $3
    `

      const values = [
        data.name,
        data.avatar_url,
        data.id
      ]

      return db.query(query, values)
    } catch (error) {
      console.error(error)
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    } catch (error) {
      console.error(error)      
    }
  },
  async recipesChef(id) {
    try {
      const results =
      await db.query(`
        SELECT * 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1`, [id])

        return results.rows
    } catch (error) {
      console.error(erro)
    }
  }
}