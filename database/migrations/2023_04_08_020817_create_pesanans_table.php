<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesanans', function (Blueprint $table) {
            $table->id();
            $table->string('tanggal');
            $table->string('no_transaksi');
            $table->string('nama_pemesan');
            $table->string('alamat_pengiriman');
            $table->string('keterangan');
            $table->string('id_customer')->nullable();
            $table->string('foto_bukti')->nullable();
            $table->boolean('status_pembayaran');
            $table->boolean('terkirim');
            $table->boolean('is_online');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanans');
    }
};
