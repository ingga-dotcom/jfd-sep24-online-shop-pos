const mysql             = require('mysql2')
const config_database   = require('../config/database')
const moment            = require('moment')
const db                = config_database.db
const eksekusi          = config_database.eksekusi



module.exports =
{

    getSemua: function() {
        let sqlSyntax = mysql.format(
             `SELECT * FROM master_produk_kategori`
        )
        return eksekusi( sqlSyntax )
    },


    getSatu: function(id_produk) {
        let sqlSyntax = mysql.format(
            `SELECT
                p.*, k.nama as kategori_nama 
            FROM master_produk as p
            LEFT JOIN master_produk_kategori as k ON k.id = p.kategori_id
            WHERE k.id = ?;`,
            [id_produk]
        )
        return eksekusi(sqlSyntax);
    },




}