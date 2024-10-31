const bcrypt        = require('bcryptjs')
const model_user    = require('../model/m_user')

module.exports =
{

    halaman_login: function(req,res) {
        if (req.session.user) {
            res.redirect('/toko')
        } else {
            let data = {
                notifikasi: req.query.notif,
            }
            res.render('v_auth/login', data)
        }
    },



    proses_login: async function(req,res) {
        // ambil inputan dari form login
        let form_email      = req.body.form_email
        let form_password   = req.body.form_password

        // cek email yg diinput, ada gak di db
        let email_exist = await model_user.cari_email(form_email)

        if (email_exist.length > 0) {
            // cek password
            let password_cocok = bcrypt.compareSync(form_password, email_exist[0].password)
            if (password_cocok) {
                // arahkan ke halaman utama sistem
                req.session.user = email_exist
                res.redirect('/toko')
            } else {
                // tendang ke halaman login
                let pesan = `Password salah!`
                res.redirect(`/auth/login?notif=${pesan}`)
            }
        } else {
            // tendang ke halaman register
            let pesan = `Email anda belum terdaftar, silakan registrasi lebih dulu!`
            res.redirect(`/auth/login?notif=${pesan}`)
        }
    },



    cek_login: function(req,res,next) {
        if (req.session.user) {
            next()
        } else {
            // lempar ke halaman login
            let pesan = `Sesi anda habis! silakan login dulu`
            res.redirect(`/auth/login?notif=${pesan}`)
        }
    },



    proses_logout: function(req,res) {
        req.session.destroy( (err) => {
            res.redirect('/') // will always fire after session is destroyed
        })
    },



    percobaan: function(req,res) {
        let inputpassword   = req.params.inputpassword
        let passwordhashed  = bcrypt.hashSync(inputpassword)

        res.send(
            `<span>inputpassword = ${inputpassword}</span><br>
            <span>passwordhashed = ${passwordhashed}</span><br>`
        )
    }



}