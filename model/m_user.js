const mysql             = require('mysql2')
const config_database   = require('../config/database')
const db                = config_database.db
const eksekusi          = config_database.eksekusi



module.exports =
{

    cari_email: function(form_email) {
        let sqlSyntax = mysql.format(
            `SELECT * FROM user WHERE email = ?`,
            [form_email]
        )
        return eksekusi( sqlSyntax )
    }

}