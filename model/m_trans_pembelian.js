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
            WHERE
                dikirim IS NULL
                AND diterima IS NULL
                AND id_user = ?`,
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
            WHERE
                dikirim IS NULL
                AND diterima IS NULL
                AND id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },



    getJumlahOrderanMasuk: function() {
        let sqlSyntax = mysql.format(
            `SELECT COUNT(id_produk) as jumlah
            FROM trans_pembelian`
        )
        return eksekusi( sqlSyntax )
    },



    getSemuaCustomer: function() {
        let sqlSyntax = mysql.format(
            `SELECT DISTINCT pmb.id_user, u.nama_lengkap, u.email
            FROM trans_pembelian as pmb
            LEFT JOIN user as u ON u.id = pmb.id_user
            WHERE
                dikirim IS NULL
                AND diterima IS NULL`
        )
        return eksekusi( sqlSyntax )
    },



    getSemuaProduk_byCustomer: function(id_user) {
        let sqlSyntax = mysql.format(
            `SELECT
                pmb.*,
                pro.nama as produk_nama, pro.harga, pro.stok, pro.foto1,
                u.email, u.nama_lengkap
            FROM trans_pembelian as pmb
            LEFT JOIN master_produk as pro  ON pro.id = pmb.id_produk
            LEFT JOIN user as u             ON u.id = pmb.id_user
            WHERE
                dikirim IS NULL
                AND diterima IS NULL
                AND id_user = ?`,
            [id_user]
        )
        return eksekusi( sqlSyntax )
    },



    updateDikirim_byIdCustomer: function(id_customer) {
        let sqlData = {
            dikirim: 1,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        let sqlSyntax = mysql.format(
            `UPDATE trans_pembelian SET ? WHERE id_user = ?`,
            [sqlData, id_customer]
        )
        return eksekusi( sqlSyntax )
    },



    getJumlahProduk_diKirim: function(req) {
        let sqlSyntax = mysql.format(
            `SELECT COUNT(id_produk) as jumlah
            FROM trans_pembelian
            WHERE
                dikirim IS NOT NULL
                AND diterima IS NULL
                AND id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },



    getDetailProduk_diKirim: function(req) {
        let sqlSyntax = mysql.format(
            `SELECT
                pmb.*,
                pro.nama as produk_nama, pro.harga, pro.stok, pro.foto1
            FROM trans_pembelian as pmb
            LEFT JOIN master_produk as pro ON pro.id = pmb.id_produk
            WHERE
                dikirim IS NOT NULL
                AND diterima IS NULL
                AND id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },




}