<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Barang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $start_date = Carbon::now()->startOfMonth()->format('Y-m-d');
        $end_date = Carbon::now()->endOfMonth()->format('Y-m-d');

        $results = Pesanan::leftJoin('detail_pesanans', 'pesanans.id', '=', 'detail_pesanans.id_pesanan')
        ->whereBetween('pesanans.tanggal', [$start_date, $end_date])
        ->groupBy('pesanans.tanggal')
        ->select('pesanans.tanggal', DB::raw('SUM(IFNULL(detail_pesanans.sub_total, 0)) AS total'))
        ->get();

        $totalByCategory = Barang::select('id_kategori_barang', DB::raw('SUM(stok) as total'))
        ->groupBy('id_kategori_barang')->with('kategori')
        ->get();

        $total_online =  Pesanan::leftJoin('detail_pesanans', 'pesanans.id', '=', 'detail_pesanans.id_pesanan')
        ->where('is_online','=',1)->select('is_online', DB::raw('SUM(IFNULL(detail_pesanans.sub_total, 0)) AS total'))
        ->get();

        $total_offline =  Pesanan::leftJoin('detail_pesanans', 'pesanans.id', '=', 'detail_pesanans.id_pesanan')
        ->where('is_online','=',0)->select('is_online', DB::raw('SUM(IFNULL(detail_pesanans.sub_total, 0)) AS total'))
        ->get();
     
      


        $key = $request->key;
        $barang = Barang::all();
        // $dataDetail = Pesanan::with('pesanan')->with('detail_barang')->get();
        return Inertia::render('AdminPanel/Pages/Dashboard',
         ['user' => Auth::user(),
          'dataDetail' => $results,
          'totalBarangByKategori' => $totalByCategory,
          'totalOnline' => $total_online,
          'totalOffline' => $total_offline,
          ]
        );
    }
}
