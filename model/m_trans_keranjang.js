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



    getJumlahProduk_diKeranjang: function(req) {
        let sqlSyntax = mysql.format(
            `SELECT COUNT(id_produk) as jumlah
            FROM trans_keranjang
            WHERE id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },



    getDetailProduk_diKeranjang: function(req) {
        let sqlSyntax = mysql.format(
            `SELECT
                krj.*,
                pro.nama as produk_nama, pro.harga, pro.stok, pro.foto1
            FROM trans_keranjang as krj
            LEFT JOIN master_produk as pro ON pro.id = krj.id_produk
            WHERE id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },



    hapus: function(req) {
        let sqlSyntax = mysql.format(
            `DELETE FROM trans_keranjang WHERE id = ?`,
            [req.params.id_keranjang]
        )
        return eksekusi( sqlSyntax )
    },



    hapus_by_user: function(req) {
        let sqlSyntax = mysql.format(
            `DELETE FROM trans_keranjang WHERE id_user = ?`,
            [req.session.user[0].id]
        )
        return eksekusi( sqlSyntax )
    },



}