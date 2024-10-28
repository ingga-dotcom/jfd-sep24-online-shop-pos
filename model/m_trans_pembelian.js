const mysql             = require('mysql2')
const config_database   = require('../config/database')
const moment            = require('moment')
const db                = config_database.db
const eksekusi          = config_database.eksekusi



module.exports =
{

    insertSemua: function(req) {
        let form_id_produk = req.body.form_id_produk
        let sqlData = []

        for (let i = 0; i < form_id_produk.length; i++) {
            sqlData.push(
                [
                    req.body.form_id_produk[i],
                    req.session.user[0].id,
                    req.body.form_qty[i],
                    req.body.form_harga_kalkulasi[i],
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                ]
            )
        }
        
        let sqlSyntax = mysql.format(
            `INSERT INTO trans_pembelian
            (id_produk, id_user, qty, harga, updated_at)
            VALUES ?`,
            [sqlData]
        )
        return eksekusi( sqlSyntax )
    },



    getJumlahProduk_diProses: function(req) {
        let sqlSyntax = mysql.format(
            `SELECT COUNT(id_produk) as jumlah
            FROM trans_pembelian
            WHERE id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },



    getDetailProduk_diProses: function(req) {
        let sqlSyntax = mysql.format(
            `SELECT
                pmb.*,
                pro.nama as produk_nama, pro.harga, pro.stok, pro.foto1
            FROM trans_pembelian as pmb
            LEFT JOIN master_produk as pro ON pro.id = pmb.id_produk
            WHERE id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },



}