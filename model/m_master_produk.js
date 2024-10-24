const mysql             = require('mysql2')
const config_database   = require('../config/database')
const moment            = require('moment')
const db                = config_database.db
const eksekusi          = config_database.eksekusi



module.exports =
{

    getSemua: function() {
        let sqlSyntax = mysql.format(
            `SELECT
                p.*, k.nama as kategori_nama 
            FROM master_produk as p
            LEFT JOIN master_produk_kategori as k ON k.id = p.kategori_id;`
        )
        return eksekusi( sqlSyntax )
    },



    getSatu: function(id_produk) {
        let sqlSyntax = mysql.format(
            `SELECT
                p.*, k.nama as kategori_nama 
            FROM master_produk as p
            LEFT JOIN master_produk_kategori as k ON k.id = p.kategori_id
            WHERE p.id = ?;`,
            [id_produk]
        )
        return eksekusi( sqlSyntax )
    },



    insert: function(req, filename_foto1, filename_foto2, filename_foto3) {
        let sqlData = {
            nama            : req.body.form_nama,
            harga           : req.body.form_harga,
            stok            : req.body.form_stok,
            kategori_id     : req.body.form_kategori,
            foto1           : filename_foto1,
            foto2           : filename_foto2,
            foto3           : filename_foto3,
            video           : req.body.form_video,
            deskripsi       : req.body.form_deskripsi,
            spesifikasi     : req.body.form_spesifikasi,
            info_penting    : req.body.form_info_penting,
            created_at      : moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by      : req.session.user[0].id,
        }

        let sqlSyntax = mysql.format(
            `INSERT INTO master_produk SET ?`,
            [sqlData]
        )
        return eksekusi( sqlSyntax )
    },



}