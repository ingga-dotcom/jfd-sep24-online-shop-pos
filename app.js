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
const c_profile      = require('./controller/c_profile')

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
app.post('/auth/logout', cek_login, c_auth.proses_logout)

app.get('/toko', cek_login, c_toko.index)

app.get('/olshop', cek_login, c_olshop.halaman_beranda)

app.get('/olshop/produk', cek_login, c_olshop.halaman_index_produk)
app.get('/olshop/produk/tambah', cek_login, c_olshop.halaman_form_tambah)
app.post('/olshop/produk/proses-insert', cek_login, c_olshop.proses_insert_produk)
app.get('/olshop/produk/detail/:id_produk', cek_login, c_olshop.detail_produk)



app.get('/olshop/produk/kategori/:id_produk', cek_login, c_olshop.produk_perkategori)
app.get('/olshop/form_search', cek_login, c_olshop.produk_search)

// Update profile password
app.post('/olshop/update_profile', cek_login, c_profile.user_profile)

// Route to redirect and send session data via POST
app.get('/profile_page', cek_login, (req, res) => {
    const sessionUser = req.session.user[0];

    // Render a form that auto-submits the session data as a POST request
    res.send(`
        <form id="sessionForm" action="/profile_page_render" method="POST">
            <input type="hidden" name="role_id" value="${sessionUser.role_id}" />
            <input type="hidden" name="nama_lengkap" value="${sessionUser.nama_lengkap}" />
            <input type="hidden" name="email" value="${sessionUser.email}" />
            <!-- Add more hidden inputs as needed for other session data -->
        </form>
        <script>
            document.getElementById('sessionForm').submit();
        </script>
    `);
});

// Final target URL to render the profile page with session data
app.post('/profile_page_render', (req, res) => {
    const sessionUser = {
        role_id: req.body.role_id,
        nama_lengkap: req.body.nama_lengkap,
        email: req.body.email,
        // Set role text based on role_id
        role: req.body.role_id === '1' ? 'Penjual' : 'Pembeli' // Default to 'Pelanggan' or another appropriate role if needed
    };

    res.render('profile_page', { sessionUser });
});



app.get('/olshop/keranjang/input/:id_produk', cek_login, c_olshop.keranjang_input)
app.get('/olshop/keranjang/list', cek_login, c_olshop.keranjang_list)
app.post('/olshop/keranjang/hapus/:id_keranjang', cek_login, c_olshop.keranjang_hapus)
app.post('/olshop/keranjang/bayar', cek_login, c_olshop.keranjang_bayar)

app.get('/olshop/orderan-masuk/list', cek_login, c_olshop.orderanMasuk_list)
app.post('/olshop/orderan-masuk/kirim-barang/:id_customer', cek_login, c_olshop.orderanMasuk_prosesKirimBarang)

app.get('/percobaan-hash-password/:inputpassword', c_auth.percobaan)


app.listen(port, ()=>{
    console.log(`Aplikasi sudah siap, buka http://localhost:${port}`)
})