const db = require('../db')
const uuid = require('uuid')
const path = require('path')
const pdfTemplate = require('../document/create-document')
const pdf = require('html-pdf');
const pg = require('pg')

class UserController {
    async createUser(req, res, next) {
        try {
            const {email, firstName, lastName} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const newPerson = await db.query(`INSERT INTO person (email, firstName, lastName, image) values ($1, $2, $3, $4) returning *`, [email, firstName, lastName, fileName])
            res.json(newPerson.rows[0])
        } catch (e) {
            next(e)
        }
    }
    async getUsers(req, res) {
        const users = await db.query(`select * from person`)
        res.json(users.rows)
    }
    async getOneUser(req, res) {
        const userId = req.params.id
        const user = await db.query(`select * from person where id = ${userId}`)

        res.json(user.rows[0])
    }
    async updateUser(req, res) {
        const {id, email, firstName, lastName} = req.body
        const user = await db.query(`UPDATE person SET email = '${email}' firstName = '${firstName}', lastName = '${lastName}' WHERE id = ${id} returning *`)
        res.json(user.rows[0])
    }
    async deleteUser(req, res) {
        const id = req.params.id
        const user = await db.query(`delete from person where id = ${id}`)
        res.json(user.rows[0])
    }
    async createPDF(req, res, next) {
        try {
            const {email} = req.body
            const user = await db.query(`select * from person where email = '${email}'`)
            let userDto = user.rows[0]
            let fileName = uuid.v4() + '.pdf'
            pdf.create(pdfTemplate(userDto.firstname, userDto.lastname, userDto.image), {}).toFile(path.resolve(__dirname, '..', 'static', 'pdf', fileName), (err, result) => {
                if(err) {
                    res.send(Promise.reject())
                }
                console.log(result)
                res.send(Promise.resolve())
            })
            await db.query(`UPDATE person set pdf = ${fileName} where id = ${userDto.id}`)
            res.json({message: true})
        } catch (e) {
            res.json({message: false})
        }
    }
}

module.exports = new UserController()