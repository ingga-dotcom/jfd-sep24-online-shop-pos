const mysql             = require('mysql2')
const config_database   = require('../config/database')
const db                = config_database.db
const eksekusi          = config_database.eksekusi


//ingga
module.exports =
{

    cari_search: function(form_search) {
        let sqlSyntax = mysql.format(
            `SELECT * FROM master_produk WHERE nama LIKE ?`,
            ['%' +form_search+ '%']

          
        )
        return eksekusi( sqlSyntax )
    }

}