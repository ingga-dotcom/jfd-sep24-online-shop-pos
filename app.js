const express       = require('express')
const app           = express()
const port          = 3000
const cookieParser  = require('cookie-parser')
const session       = require('express-session')
const fileUpload    = require('express-fileupload')
const c_beranda     = require('./controller/c_beranda')
const c_auth        = require('./controller/c_auth')
const cek_login     = c_auth.cek_login
const c_toko        = require('./controller/c_toko')
const c_olshop      = require('./controller/c_olshop')


// settingan untuk data session login
app.use( cookieParser('rahasia') )
app.use( session({
    secret: 'rahasia',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: (1000 * 60) * 30
        // batas session expired:
        // 1000 milidetik * 60 = 1 menit
        // 1 menit * 30 = 1/2 jam
    }
}))


app.use( express.urlencoded({extended:false}) )
app.use( express.static('public') )
app.use( fileUpload() )


app.set('view engine', 'ejs')
app.set('views', './view')


app.get('/', c_beranda.halaman_awal)
app.get('/auth/login', c_auth.halaman_login)
app.post('/auth/proses-login', c_auth.proses_login)

app.get('/toko', cek_login, c_toko.index)

app.get('/olshop', cek_login, c_olshop.halaman_beranda)
app.get('/olshop/produk', cek_login, c_olshop.halaman_index_produk)
app.get('/olshop/produk/tambah', cek_login, c_olshop.halaman_form_tambah)
app.post('/olshop/produk/proses-insert', cek_login, c_olshop.proses_insert_produk)
app.get('/olshop/produk/detail/:id_produk', cek_login, c_olshop.detail_produk)
app.get('/olshop/keranjang/input/:id_produk', cek_login, c_olshop.keranjang_input)


app.listen(port, ()=>{
    console.log(`Aplikasi sudah siap, buka http://localhost:${port}`)
})