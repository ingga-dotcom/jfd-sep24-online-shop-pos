const path              = require('path')
const moment            = require('moment')
const m_prod_kategori   = require('../model/m_master_produk_kategori')
const m_master_produk   = require('../model/m_master_produk')
const m_trans_keranjang = require('../model/m_trans_keranjang')
const m_trans_pembelian = require('../model/m_trans_pembelian')

module.exports =
{

    halaman_beranda: async function(req,res) {
        let data = {
            req                     : req,
            kategoriProduk          : await m_prod_kategori.getSemua(),
            produk_diKeranjang      : await m_trans_keranjang.getJumlahProduk_diKeranjang(req),
            produkJual              : await m_master_produk.getSemua(),
            moment                  : moment,
            notifikasi              : req.query.notif,
            produkExist_diKeranjang : await m_trans_keranjang.cekProdukExist(req),
            produk_diProses         : await m_trans_pembelian.getJumlahProduk_diProses(req),
            detailProduk_diProses   : await m_trans_pembelian.getDetailProduk_diProses(req),
            orderanMasuk            : await m_trans_pembelian.getJumlahOrderanMasuk(),
            produk_diKirim          : await m_trans_pembelian.getJumlahProduk_diKirim(req),
            detailProduk_diKirim    : await m_trans_pembelian.getDetailProduk_diKirim(req),
        }
        res.render('v_olshop/beranda', data)
    },



    halaman_index_produk: async function(req,res) {
        let data = {
            req                 : req,
            kategoriProduk      : await m_prod_kategori.getSemua(),
            produk_diKeranjang  : await m_trans_keranjang.getJumlahProduk_diKeranjang(req),
            produkJual          : await m_master_produk.getSemua(),
            notifikasi          : req.query.notif,
            produk_diProses     : await m_trans_pembelian.getJumlahProduk_diProses(req),
            detailProduk_diProses   : await m_trans_pembelian.getDetailProduk_diProses(req),
            orderanMasuk            : await m_trans_pembelian.getJumlahOrderanMasuk(),
            produk_diKirim          : await m_trans_pembelian.getJumlahProduk_diKirim(req),
            detailProduk_diKirim    : await m_trans_pembelian.getDetailProduk_diKirim(req),
        }
        res.render('v_olshop/produk/index', data)
    },



    halaman_form_tambah: async function(req,res) {
        let data = {
            req                 : req,
            kategoriProduk      : await m_prod_kategori.getSemua(),
            produk_diKeranjang  : await m_trans_keranjang.getJumlahProduk_diKeranjang(req),
            produk_diProses     : await m_trans_pembelian.getJumlahProduk_diProses(req),
            detailProduk_diProses   : await m_trans_pembelian.getDetailProduk_diProses(req),
            orderanMasuk            : await m_trans_pembelian.getJumlahOrderanMasuk(),
            produk_diKirim          : await m_trans_pembelian.getJumlahProduk_diKirim(req),
            detailProduk_diKirim    : await m_trans_pembelian.getDetailProduk_diKirim(req),
        }
        res.render('v_olshop/produk/form-tambah', data)
    },



    proses_insert_produk: async function(req,res) {
        let foto1            = req.files.form_foto1
        let foto2            = req.files.form_foto2
        let foto3            = req.files.form_foto3

        // ganti nama file asli
        let email           = req.session.user[0].email.replaceAll('.','-')
        let datetime        = moment().format('YYYYMMDD_HHmmss')

        let filename_foto1  = email + '_' + datetime + '_' + ((foto1) ? foto1.name : '')
        let filename_foto2  = email + '_' + datetime + '_' + ((foto2) ? foto2.name : '')
        let filename_foto3  = email + '_' + datetime + '_' + ((foto3) ? foto3.name : '')

        let folder1_simpan  = path.join(__dirname, '../public/upload/produk-foto', filename_foto1)
        let folder2_simpan  = path.join(__dirname, '../public/upload/produk-foto', filename_foto2)
        let folder3_simpan  = path.join(__dirname, '../public/upload/produk-foto', filename_foto3)

        let pesan_upload    = ''

        foto1.mv(folder1_simpan, async function(err) {
            if (err) {
                pesan_upload += `<br>foto 1 gagal upload`
            } else {
                pesan_upload += `<br>foto 1 berhasil upload`
            }
        })

        if (foto2) {
            foto2.mv(folder2_simpan, async function(err) {
                if (err) {
                    pesan_upload += `<br>foto 2 gagal upload`
                } else {
                    pesan_upload += `<br>foto 2 berhasil upload`
                }
            })
        }

        if (foto3) {
            foto3.mv(folder3_simpan, async function(err) {
                if (err) {
                    pesan_upload += `<br>foto 3 gagal upload`
                } else {
                    pesan_upload += `<br>foto 3 berhasil upload`
                }
            })
        }

        try {
            let insert = await m_master_produk.insert( req, filename_foto1, filename_foto2, filename_foto3 )
            if (insert.affectedRows > 0) {
                res.redirect(`/olshop/produk?notif=Berhasil input produk baru${pesan_upload}`)
            }
        } catch (error) {
            throw error
        }
    },



    detail_produk: async function(req,res) {
        let id = req.params.id_produk
        let data = {
            req                 : req,
            kategoriProduk      : await m_prod_kategori.getSemua(),
            produk_diKeranjang  : await m_trans_keranjang.getJumlahProduk_diKeranjang(req),
            produkJual          : await m_master_produk.getSatu( id ),
            produk_diProses     : await m_trans_pembelian.getJumlahProduk_diProses(req),
            detailProduk_diProses   : await m_trans_pembelian.getDetailProduk_diProses(req),
            orderanMasuk            : await m_trans_pembelian.getJumlahOrderanMasuk(),
            produk_diKirim          : await m_trans_pembelian.getJumlahProduk_diKirim(req),
            detailProduk_diKirim    : await m_trans_pembelian.getDetailProduk_diKirim(req),
            moment              : moment,
        }
        res.render('v_olshop/produk/detail', data)
    },



    keranjang_input: async function(req,res) {
        try {
            let insert  = await m_trans_keranjang.masukkan(req)
            if (insert.affectedRows > 0) {
                res.redirect(`/olshop?notif=Berhasil masukkan produk ke keranjang`)
            }
        } catch (error) {
            res.redirect(`/olshop?notif=${error.message}`)
        }
    },



    keranjang_list: async function(req,res) {
        let data = {
            req                     : req,
            kategoriProduk          : await m_prod_kategori.getSemua(),
            produk_diKeranjang      : await m_trans_keranjang.getJumlahProduk_diKeranjang(req),
            detailProduk_keranjang  : await m_trans_keranjang.getDetailProduk_diKeranjang(req),
            moment                  : moment,
            notifikasi              : req.query.notif,
            user_id_role            : req.session.user[0].role_id,
            produk_diProses         : await m_trans_pembelian.getJumlahProduk_diProses(req),
            detailProduk_diProses   : await m_trans_pembelian.getDetailProduk_diProses(req),
            orderanMasuk            : await m_trans_pembelian.getJumlahOrderanMasuk(),
            produk_diKirim          : await m_trans_pembelian.getJumlahProduk_diKirim(req),
            detailProduk_diKirim    : await m_trans_pembelian.getDetailProduk_diKirim(req),
        }
        res.render('v_olshop/keranjang/list', data)
    },



    keranjang_hapus: async function(req,res) {
        // proses hapus data keranjang
        try {
            let hapusData = await m_trans_keranjang.hapus(req)
            if (hapusData.affectedRows > 0) {
                res.redirect(`/olshop/keranjang/list?notif=Berhasil hapus produk dari keranjang`)
            }
        } catch (error) {
            res.redirect(`/olshop/keranjang/list?notif=${error.message}`)
        }
    },



    keranjang_bayar: async function(req,res) {
        try {
            let insert  = await m_trans_pembelian.insertSemua(req)
            if (insert.affectedRows > 0) {
                // hapus keranjang by id_user
                let hapusKeranjang = await m_trans_keranjang.hapus_by_user(req)
                if (hapusKeranjang.affectedRows > 0) {
                    res.redirect(`/olshop?notif=Berhasil bayar`)
                }
            }
        } catch (error) {
            res.redirect(`/olshop?notif=${error.message}`)
        }
    },



    orderanMasuk_list: async function(req,res) {
        let semuaCustomer_ygBeli = await m_trans_pembelian.getSemuaCustomer()
        for (const i in semuaCustomer_ygBeli) {
            let id_user = semuaCustomer_ygBeli[i].id_user
            semuaCustomer_ygBeli[i].produk_yang_dibeli = await m_trans_pembelian.getSemuaProduk_byCustomer(id_user)
        }

        let data = {
            req                     : req,
            kategoriProduk          : await m_prod_kategori.getSemua(),
            produk_diKeranjang      : await m_trans_keranjang.getJumlahProduk_diKeranjang(req),
            detailProduk_keranjang  : await m_trans_keranjang.getDetailProduk_diKeranjang(req),
            moment                  : moment,
            notifikasi              : req.query.notif,
            user_id_role            : req.session.user[0].role_id,
            produk_diProses         : await m_trans_pembelian.getJumlahProduk_diProses(req),
            detailProduk_diProses   : await m_trans_pembelian.getDetailProduk_diProses(req),
            orderanMasuk            : await m_trans_pembelian.getJumlahOrderanMasuk(),
            orderanMasuk_detail     : semuaCustomer_ygBeli,
            produk_diKirim          : await m_trans_pembelian.getJumlahProduk_diKirim(req),
            detailProduk_diKirim    : await m_trans_pembelian.getDetailProduk_diKirim(req),
        }
        res.render('v_olshop/orderan-masuk/list', data)
    },



    orderanMasuk_prosesKirimBarang: async function(req,res) {
        let id_customer = req.params.id_customer
        try {
            let update  = await m_trans_pembelian.updateDikirim_byIdCustomer(id_customer)
            if (update.affectedRows > 0) {
                res.redirect(`/olshop/orderan-masuk/list?notif=Berhasil bayar`)
            }
        } catch (error) {
            res.redirect(`/olshop/orderan-masuk/list?notif=${error.message}`)
        }
    },

}