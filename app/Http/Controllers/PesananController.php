<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Barang;
use App\Models\DetailPesanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Haruncpi\LaravelIdGenerator\IdGenerator;


class PesananController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $key = $request->key;
        $pesanan = Pesanan::with('detail_pesanan')->orderBy('created_at', 'DESC')->where('is_online', 1)->where('nama_pemesan', 'LIKE', '%' . $key . '%')  
            ->paginate(10);
        return Inertia::render('AdminPanel/Pages/Transaksi/Pesanan/Pesanan', [
            'pesanan_data' => $pesanan,
        ]);
    }

    public function history(Request $request)
    {
        $key = $request->key;
        $pesanan = Pesanan::with('detail_pesanan')->orderBy('created_at', 'DESC')->where('is_online', 1)->where('id_customer', Auth::user()->id)->where('nama_pemesan', 'LIKE', '%' . $key . '%')  
            ->paginate(10);
        return Inertia::render('LandingPage/Pages/History', [
            'pesanan_data' => $pesanan,
        ]);
    }

    public function pembelianPending(Request $request)
    {
        $key = $request->key;
        $pesanan = Pesanan::with('detail_pesanan')->orderBy('created_at', 'DESC')->where('status_pembayaran', 0)->where('is_online', 1)->where('id_customer', Auth::user()->id)->where('nama_pemesan', 'LIKE', '%' . $key . '%')  
            ->paginate(10);
        return Inertia::render('LandingPage/Pages/PembelianPending', [
            'pesanan_data' => $pesanan,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $barang = Barang::all();
        return Inertia::render('AdminPanel/Pages/Transaksi/Pesanan/TambahPesanan', [
            'barang_dropdown' => $barang
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_pemesan' => 'required',
            'alamat_pengiriman' => 'required'
        ],
        [
            'nama_pemesan.required' => 'Nama Pemesan Tidak Boleh Kosong',
            'alamat_pengiriman.required' => 'Alamat Tidak Boleh Kosong',
        ]);

        if ($request->hasFile('foto_bukti')) {
            $image = $request->file('foto_bukti')->store('uploads');
        } else {
            $image = '';
        }


        $date = $request->tanggal;
 
        $year = Carbon::createFromFormat('Y-m-d', $date)->format('Y');
        $month = Carbon::createFromFormat('Y-m-d', $date)->format('m');
        $prefix = $year . '/' . $month . '/PSN/';
        $no = Auth::user()->level === '1' ? $request->no_transaksi : IdGenerator::generate(['table' => 'pesanans', 'field' =>'no_transaksi', 'length' => 16, 'prefix' => $prefix, 'reset_on_prefix_change' => true]);
      
      
        

        $pesanan = new Pesanan();
        $pesanan->no_transaksi = $no;
        $pesanan->tanggal = $request->tanggal;
        $pesanan->nama_pemesan = $request->nama_pemesan;
        $pesanan->alamat_pengiriman = $request->alamat_pengiriman;
        $pesanan->keterangan = $request->keterangan;
        $pesanan->is_online = $request->is_online;
        $pesanan->terkirim = $request->terkirim;
        $pesanan->foto_bukti = $image;
        $pesanan->status_pembayaran = $request->status_pembayaran;
        $pesanan->id_customer = Auth::user()->id;
        $pesanan->save();


        foreach ($request->detail as $key => $value) {
            $detail = array(
                'id_pesanan'   => $pesanan->id,
                'id_barang' => $value['id'],
                'qty' => $value['qty'],
                'sub_total' => $value['sub_total'],
                'ukuran' => $request->ukuran,
            );

            $detail = DetailPesanan::create($detail);
        }

        if (Auth::user()->level === '1') {
            return to_route('pesanan.index');
        }
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Pesanan $pesanan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pesanan $pesanan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_pemesan' => 'required',
            'alamat_pengiriman' => 'required'
        ],
        [
            'nama_pemesan.required' => 'Nama Pemesan Tidak Boleh Kosong',
            'alamat_pengiriman.required' => 'Alamat Tidak Boleh Kosong',
        ]);


        $pesanan = Pesanan::find($id);
        $pesanan->no_transaksi = $request->no_transaksi;
        $pesanan->tanggal = $request->tanggal;
        $pesanan->nama_pemesan = $request->nama_pemesan;
        $pesanan->alamat_pengiriman = $request->alamat_pengiriman;
        $pesanan->keterangan = $request->keterangan;
        $pesanan->is_online = $request->is_online;
        $pesanan->terkirim = $request->terkirim;
        $pesanan->save();

        foreach ($request->detail as $key => $value) {
            $data_barang = Barang::find($value['id']); 
            $data_barang->diskon = $value['diskon']; 
            $data_barang->foto_barang = $value['foto_barang'];
            $data_barang->harga = $value['harga'];
            $data_barang->id_kategori_barang = $value['id_kategori_barang'];
            $data_barang->nama_barang = $value['nama_barang'];
            $data_barang->stok = $value['stok'] - $value['qty'];
            $data_barang->ukuran = $value['ukuran'];
      
            $data_barang->save();
            
            // dd($data_barang);
        }


        // foreach ($request->detail as $key => $value) {
        //     $detail = array(
        //         'id_pesanan'   => $pesanan->id,
        //         'id_barang' => $value['id'],
        //         'qty' => $value['qty']
        //     );

        //     $detail = DetailPesanan::create($detail);
        // }

        if (Auth::user()->level === '1') {
            return to_route('pesanan.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pesanan $pesanan)
    {
        //
    }

    public function genrateNo(Request $request)
    {
        // dd($request->date);
        $date = $request->date;
        $year = Carbon::createFromFormat('Y-m-d', $date)->format('Y');
        $month = Carbon::createFromFormat('Y-m-d', $date)->format('m');
        $prefix = $year . '/' . $month . '/PSN/';
        $id = IdGenerator::generate(['table' => 'pesanans', 'field' =>'no_transaksi', 'length' => 16, 'prefix' => $prefix, 'reset_on_prefix_change' => true]);

        // dd($randomItems);

        return response()->json([
            'message' => 'success',
            'data' => $id,
        ], 200);
    }

    public function ubah(Request $request, $id)
    {
        $request->validate([
            'nama_pemesan' => 'required',
            'alamat_pengiriman' => 'required'
        ],
        [
            'nama_pemesan.required' => 'Nama Pemesan Tidak Boleh Kosong',
            'alamat_pengiriman.required' => 'Alamat Tidak Boleh Kosong',
        ]);

        if ($request->hasFile('foto_bukti')) {
            $image = $request->file('foto_bukti')->store('uploads');
        } else {
            $image = '';
        }


        $date = $request->tanggal;
 
        $year = Carbon::createFromFormat('Y-m-d', $date)->format('Y');
        $month = Carbon::createFromFormat('Y-m-d', $date)->format('m');
        $prefix = $year . '/' . $month . '/PSN/';
        $no = Auth::user()->level === '1' ? $request->no_transaksi : IdGenerator::generate(['table' => 'pesanans', 'field' =>'no_transaksi', 'length' => 16, 'prefix' => $prefix, 'reset_on_prefix_change' => true]);
      
      
        

        $pesanan = Pesanan::find($request->id);
        $pesanan->no_transaksi = $request->no_transaksi;
        $pesanan->tanggal = $request->tanggal;
        $pesanan->nama_pemesan = $request->nama_pemesan;
        $pesanan->alamat_pengiriman = $request->alamat_pengiriman;
        $pesanan->keterangan = $request->keterangan;
        $pesanan->is_online = $request->is_online;
        $pesanan->terkirim = $request->terkirim;
        $pesanan->foto_bukti = $image;
        $pesanan->status_pembayaran = $request->status_pembayaran;
        $pesanan->id_customer = Auth::user()->id;
        $pesanan->save();


        if (Auth::user()->level === '1') {
            return to_route('pesanan.index');
        }
    }

}

   
