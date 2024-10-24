const mysql             = require('mysql2')
const config_database   = require('../config/database')
const moment            = require('moment')
const db                = config_database.db
const eksekusi          = config_database.eksekusi



module.exports =
{
    cekProdukExist: function(req) {
        let sqlSyntax = mysql.format(
            `SELECT * FROM trans_keranjang
            WHERE id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },

    masukkan: function(req) {
        let sqlData = {
            id_produk   : req.params.id_produk,
            id_user     : req.session.user[0].id,
            qty         : 1,
            updated_at  : moment().format('YYYY-MM-DD HH:mm:ss'),
        }

        let sqlSyntax = mysql.format(
            `INSERT INTO trans_keranjang SET ?`,
            [sqlData]
        )
        return eksekusi( sqlSyntax )
    },
}