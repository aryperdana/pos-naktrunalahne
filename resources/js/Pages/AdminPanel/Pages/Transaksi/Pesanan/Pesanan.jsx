import {
    Alert,
    Input,
    Pagination,
    Textarea,
} from "@/Pages/AdminPanel/Components";
import { Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import MainLayout from "../../../Layouts";
import { AiOutlineEye } from "react-icons/ai";

const Pesanan = ({ pesanan_data }) => {
    const [modalConfig, setModalConfig] = useState({
        type: "",
        show: false,
        data: {},
    });
    const [alertConfig, setAlertConfig] = useState({
        show: false,
        type: "error",
        text: "",
    });

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        delete: destroy,
    } = useForm({
        id: "",
        tanggal: "",
        no_transaksi: "",
        nama_pemesan: "",
        alamat_pengiriman: "",
        keterangan: "-",
        detail: [],
        is_online: 1,
        terkirim: 0,
    });

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        put(route("pesanan.update", data.id), {
            onSuccess: () => {
                setModalConfig({ ...modalConfig, show: false, type: "" });
                setAlertConfig({
                    ...alertConfig,
                    show: true,
                    type: "success",
                    text: "Status Pengiriman Berhasil Diubah",
                });
                reset();
            },
            onError: () => {},
            onFinish: () => {},
        });
    };

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    };

    const total =
        modalConfig?.data?.detail_pesanan?.length > 0 &&
        modalConfig?.data?.detail_pesanan?.reduce(
            (acc, curr) =>
                acc +
                curr.qty *
                    curr?.detail_barang?.harga *
                    ((100 - curr?.detail_barang?.diskon) / 100),
            0
        );

    console.log("bos", pesanan_data);

    return (
        <MainLayout title="Pesanan" navbarTitle="Pesanan">
            {alertConfig.show && (
                <Alert type={alertConfig.type} text={alertConfig.text} />
            )}
            <div className="card w-full bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="flex justify-between mb-3">
                        <div className="form-control w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered input-sm w-full max-w-xs"
                            />
                        </div>
                        <Link
                            className="btn btn-primary btn-sm"
                            href="pesanan/create"
                        >
                            Tambah
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-compact table-auto w-full">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th className="text-center">No</th>
                                    <th className="text-center">Aksi</th>
                                    <th className="text-center">Tanggal</th>
                                    <th className="text-center">
                                        No. Transaksi
                                    </th>
                                    <th className="text-center">Pemesan</th>
                                    <th className="text-center">
                                        Alamat Pengiriman
                                    </th>
                                    <th className="text-center">Keterangan</th>
                                    <th className="text-center">
                                        Status Pembayaran
                                    </th>
                                    <th className="text-center">Kirim</th>
                                </tr>
                            </thead>
                            <tbody>
                                {console.log(pesanan_data)}
                                {pesanan_data?.data?.length > 0 ? (
                                    pesanan_data?.data?.map((val, ind) => (
                                        <tr>
                                            <td className="w-10">{ind + 1}</td>
                                            <td className="w-10">
                                                <div className="btn-group">
                                                    <button
                                                        className="btn btn-outline btn-info btn-sm"
                                                        onClick={() => {
                                                            setModalConfig({
                                                                ...modalConfig,
                                                                show: true,
                                                                type: "update",
                                                                data: val,
                                                            });
                                                        }}
                                                    >
                                                        <AiOutlineEye />
                                                    </button>
                                                </div>
                                            </td>
                                            <td>{val.tanggal}</td>
                                            <td>{val.no_transaksi}</td>
                                            <td>{val.nama_pemesan}</td>
                                            <td>{val.alamat_pengiriman}</td>
                                            <td>{val.keterangan}</td>
                                            <td>
                                                {val.status_pembayaran === 1
                                                    ? "Sudah Dibayar"
                                                    : "Belum Dibayar"}
                                            </td>
                                            <td className="text-center">
                                                {val.terkirim ? (
                                                    "Data Sudah Dikirim"
                                                ) : (
                                                    <button
                                                        className="btn btn-outline btn-primary btn-sm"
                                                        onClick={() => {
                                                            setModalConfig({
                                                                ...modalConfig,
                                                                show: true,
                                                                type: "kirim",
                                                                data: val,
                                                            });

                                                            setData({
                                                                ...data,
                                                                id: val.id,
                                                                tanggal:
                                                                    val.tanggal,
                                                                no_transaksi:
                                                                    val.no_transaksi,
                                                                nama_pemesan:
                                                                    val.nama_pemesan,
                                                                alamat_pengiriman:
                                                                    val.alamat_pengiriman,
                                                                keterangan:
                                                                    val.keterangan,
                                                                detail: val.detail_pesanan.map(
                                                                    (res) => ({
                                                                        id: res
                                                                            ?.detail_barang
                                                                            ?.id,
                                                                        diskon: res
                                                                            ?.detail_barang
                                                                            ?.diskon,
                                                                        foto_barang:
                                                                            res
                                                                                ?.detail_barang
                                                                                ?.foto_barang,
                                                                        harga: res
                                                                            ?.detail_barang
                                                                            ?.harga,
                                                                        id_kategori_barang:
                                                                            res
                                                                                ?.detail_barang
                                                                                ?.id_kategori_barang,
                                                                        nama_barang:
                                                                            res
                                                                                ?.detail_barang
                                                                                ?.nama_barang,
                                                                        qty: res?.qty,
                                                                        stok: res
                                                                            ?.detail_barang
                                                                            ?.stok,
                                                                        ukuran: res
                                                                            ?.detail_barang
                                                                            ?.ukuran,
                                                                    })
                                                                ),
                                                                is_online:
                                                                    val.is_online,
                                                                terkirim: 1,
                                                            });
                                                        }}
                                                    >
                                                        Kirim
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center font-bold text-xl"
                                        >
                                            Tidak Ada Data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center">
                        {pesanan_data?.total > 10 && (
                            <Pagination
                                next={pesanan_data?.next_page_url}
                                prev={pesanan_data?.prev_page_url}
                                curr={pesanan_data?.current_page}
                            />
                        )}
                    </div>
                </div>
            </div>

            <input
                type="checkbox"
                className="modal-toggle"
                checked={modalConfig.show}
            />
            <div className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <div className="font-bold mb-3">Detail Data Pesanan</div>
                    <hr />
                    <div className="modal-middle mt-3">
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid grid-rows-1">
                                    <Input
                                        label="Tanggal Pesanan"
                                        name="tanggal"
                                        disabled
                                        placeholder="Masukan tanggal"
                                        type="date"
                                        value={modalConfig.data.tanggal}
                                    />
                                    <Input
                                        label="Pemesan"
                                        disabled
                                        name="nama_pemesan"
                                        value={modalConfig.data.nama_pemesan}
                                        placeholder="Masukan pemesan"
                                    />
                                    <Textarea
                                        label="Keterangan"
                                        disabled
                                        value={modalConfig.data.keterangan}
                                        name="keterangan"
                                        placeholder="Masukan keterangan"
                                        size="h-16"
                                    />
                                </div>
                                <div className="grid grid-rows-1">
                                    <Input
                                        label="No. Transaksi"
                                        name="no_transaksi"
                                        disabled
                                        value={modalConfig.data.no_transaksi}
                                        placeholder="Pilih tanggal terlebih dahulu"
                                        type="text"
                                        // value={noTransaksi}
                                    />
                                    <Textarea
                                        label="Alamat"
                                        disabled
                                        value={
                                            modalConfig.data.alamat_pengiriman
                                        }
                                        name="alamat_pengiriman"
                                        placeholder="Masukan alamat pengiriman"
                                        size="h-36"
                                    />
                                </div>
                            </div>
                            {console.log(modalConfig)}
                            <b>Detail Barang</b>
                            <div className="overflow-x-auto ">
                                <table className="table table-compact table-auto w-full">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th className="text-center">No</th>
                                            <th className="text-center">
                                                Nama Barang
                                            </th>
                                            <th className="text-center">Qty</th>
                                            <th className="text-center">
                                                Harga
                                            </th>
                                            <th className="text-center">
                                                Diskon
                                            </th>
                                            <th className="text-center">
                                                Sub Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modalConfig?.data?.detail_pesanan
                                            ?.length > 0 ? (
                                            <>
                                                {modalConfig?.data?.detail_pesanan?.map(
                                                    (val, ind) => {
                                                        const sumWithQty =
                                                            parseInt(val?.qty) *
                                                            parseInt(
                                                                val
                                                                    ?.detail_barang
                                                                    ?.harga
                                                            );

                                                        const subTotal =
                                                            parseInt(
                                                                sumWithQty -
                                                                    parseFloat(
                                                                        val
                                                                            ?.detail_barang
                                                                            ?.diskon /
                                                                            100
                                                                    ) *
                                                                        parseInt(
                                                                            sumWithQty
                                                                        )
                                                            );

                                                        return (
                                                            <>
                                                                <tr>
                                                                    <td className="w-10">
                                                                        {ind +
                                                                            1}
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            val
                                                                                ?.detail_barang
                                                                                ?.nama_barang
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            val?.qty
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {rupiah(
                                                                            val
                                                                                ?.detail_barang
                                                                                ?.harga
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            val
                                                                                ?.detail_barang
                                                                                ?.diskon
                                                                        }{" "}
                                                                        %
                                                                    </td>
                                                                    <td>
                                                                        {rupiah(
                                                                            subTotal
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        );
                                                    }
                                                )}
                                                <tr>
                                                    <th
                                                        colSpan="5"
                                                        className="text-right"
                                                    >
                                                        Total
                                                    </th>
                                                    <th>{rupiah(total)}</th>
                                                </tr>
                                            </>
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="text-center font-bold text-xl"
                                                >
                                                    Tidak Ada Data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="modal-action">
                                <button
                                    className="btn btn-sm"
                                    type="reset"
                                    onClick={() => {
                                        setModalConfig({
                                            ...modalConfig,
                                            show: false,
                                            type: "",
                                            data: {},
                                        });
                                        reset();
                                    }}
                                >
                                    Tutup
                                </button>
                                {modalConfig.type === "kirim" && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        disabled={processing}
                                    >
                                        TerKirim
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Pesanan;
