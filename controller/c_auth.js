module.exports =
{

    halaman_login: function(req,res) {
        res.render('v_auth/login')
    },



    proses_login: function(req,res) {
        // bikinin sekalian, untuk ambil inputan dari form login
        let form_email           = req.body.form_email
        let form_password        = req.body.form_password

        //cek email yg input apakah sdh ada, kalo tdk ada di db suruh register dulu
    }

}