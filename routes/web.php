<?php
use App\Http\Controllers\LoginController;
use App\Http\Controllers\KategoriBarangController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SemuaProdukController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\LaporanRekapPenjualanController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', [LayoutController::class, 'index'])->name('layout')->middleware('auth');

Route::get('/', function () {
    return Inertia::render('LandingPage/Pages/Welcome');
})->middleware('access.without.login');

// Route::get('/semua-produk', function () {
//     return Inertia::render('LandingPage/Pages/SemuaProduk/SemuaProduk');
// });

Route::get('/semua-produk', [SemuaProdukController::class, 'index'])->middleware('access.without.login');
Route::get('/produk-terbaru', [SemuaProdukController::class, 'produkTerbaru'])->middleware('access.without.login');
Route::get('/diskon-produk', [SemuaProdukController::class, 'produkDiskon'])->middleware('access.without.login');
Route::get('/udeng', [SemuaProdukController::class, 'udeng'])->middleware('access.without.login');
Route::get('/saput', [SemuaProdukController::class, 'saput'])->middleware('access.without.login');
Route::get('/kamen', [SemuaProdukController::class, 'kamen'])->middleware('access.without.login');
Route::get('/baju', [SemuaProdukController::class, 'baju'])->middleware('access.without.login');
Route::get('/profile-customer/{id}', [UserController::class, 'profile'])->middleware('access.without.login');
Route::get('/history', [PesananController::class, 'history'])->middleware('access.without.login');
Route::get('/pembelian-pending', [PesananController::class, 'pembelianPending'])->middleware('access.without.login');
Route::get('/register', function () {
    return Inertia::render('Auth/Register', [ 'user' => Auth::user(),]);
})->middleware('access.without.login');
Route::resource('/admin/user', UserController::class);



Route::controller(LoginController::class)->group(function () {
    Route::get('login', 'index')->name('login');
    Route::post('login/proses', 'proses')->name("login.proses");
    Route::get('logout', 'logout');
});

Route::group(['middleware' => ['auth']], function () {
    Route::group(['middleware' => ['checkUserLogin:1']], function () {
        Route::get('/admin', [DashboardController::class, 'index']);
        Route::resource('/admin/kategori', KategoriBarangController::class);
        Route::resource('/admin/barang', BarangController::class);
        Route::post('/admin/barang/ubah/{id}', [BarangController::class, 'ubah']);
        Route::resource('/admin/pesanan', PesananController::class);
        Route::post('/pesanan/ubah/{id}', [PesananController::class, 'ubah']);
        Route::resource('/admin/kasir', KasirController::class);
        Route::resource('/admin/keranjang', KeranjangController::class);
        Route::resource('/admin/laporan-rekap-penjualan', LaporanRekapPenjualanController::class);
    });
});


// require __DIR__.'/auth.php';
