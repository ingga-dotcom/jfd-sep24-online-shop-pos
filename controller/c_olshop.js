const m_prod_kategori = require('../model/m_master_produk_kategori')
const m_master_produk = require('../model/m_master_produk')

module.exports =
{

    halaman_beranda: async function(req,res) {
        let data = {
            kategoriProduk: await m_prod_kategori.getSemua()
        }
        res.render('v_olshop/beranda', data)
    },



    halaman_index_produk: async function(req,res) {
        let data = {
            kategoriProduk: await m_prod_kategori.getSemua()
        }
        res.render('v_olshop/produk/index', data)
    },



    halaman_form_tambah: async function(req,res) {
        let data = {
            kategoriProduk: await m_prod_kategori.getSemua()
        }
        res.render('v_olshop/produk/form-tambah', data)
    },



    proses_insert_produk: async function(req,res) {
        try {
            let insert = await m_master_produk.insert( req )
            if (insert.affectedRows > 0) {
                res.redirect('/olshop/produk?notif=Berhasil input produk baru')
            }
        } catch (error) {
            throw error
        }
    },

}