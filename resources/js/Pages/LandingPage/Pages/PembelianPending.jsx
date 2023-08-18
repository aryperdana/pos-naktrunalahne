import { Link, Head, useForm, router } from "@inertiajs/react";
import { FooterLayout, NavbarLayout } from "../Layouts";
import { AiOutlineEye } from "react-icons/ai";
import React, { useState } from "react";
import { Input, Pagination, Textarea } from "@/Pages/AdminPanel/Components";

export default function History({ auth, pesanan_data }) {
    const [modalConfig, setModalConfig] = useState({
        type: "",
        show: false,
        data: {},
    });

    const [modalConfigConfirm, setModalConfigConfirm] = useState({
        show: false,
        data: {},
    });
    const [alertConfig, setAlertConfig] = useState({
        show: false,
        type: "error",
        text: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    console.log(auth);

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
        nama_pemesan: auth?.user?.name,
        alamat_pengiriman: "",
        keterangan: "-",
        tanggal: new Date().toISOString().slice(0, 10),
        is_online: 1,
        terkirim: 0,
        ukuran: "",
        foto_bukti: "",
        status_pembayaran: 0,
        no_transaksi: "",
    });

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`pesanan/ubah/${data.id}`, data, {
            onSuccess: () => {
                setAlertConfig({
                    ...alertConfig,
                    show: true,
                    type: "success",
                    text: "Barang dipesan",
                });
                setModalConfigConfirm({ show: false });
                reset();
            },
            onError: () => {},
            onFinish: () => {},
        });
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
                curr?.qty *
                    curr?.detail_barang?.harga *
                    ((100 - curr?.detail_barang?.diskon) / 100),
            0
        );

    const totalModalConfirm =
        modalConfigConfirm?.data?.detail_pesanan?.length > 0 &&
        modalConfigConfirm?.data?.detail_pesanan?.reduce(
            (acc, curr) =>
                acc +
                curr?.qty *
                    curr?.detail_barang?.harga *
                    ((100 - curr?.detail_barang?.diskon) / 100),
            0
        );
    console.log("haloo", total);

    return (
        <>
            <Head title="NAKTRUNALAHNE" />
            <div className="w-full py-8">
                {/* Navbar section */}
                <NavbarLayout user={auth?.user?.name} userId={auth?.user?.id} />

                <div className="max-w-7xl my-4 mx-auto p-7">
                    <div className="mb-10">
                        <b
                            style={{
                                textTransform: "capitalize",
                                fontSize: 20,
                            }}
                        >
                            Menunggu Pembayaran {auth?.user?.name}
                        </b>
                        <hr />
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
                                    <th className="text-center">Kirim</th>
                                    <th className="text-center">Bayar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pesanan_data?.data?.length > 0 ? (
                                    pesanan_data?.data?.map((val, ind) => (
                                        <tr>
                                            {console.log(val)}
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
                                            <td className="text-center">
                                                {val.terkirim
                                                    ? "Sudah Dikirim"
                                                    : "Belum Dikirim"}
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => {
                                                        setModalConfigConfirm({
                                                            show: true,
                                                            data: val,
                                                        });
                                                        setData({
                                                            alamat_pengiriman:
                                                                val.alamat_pengiriman,
                                                            id: val.id,
                                                            is_online:
                                                                val.is_online,
                                                            keterangan:
                                                                val.keterangan,
                                                            nama_pemesan:
                                                                val.nama_pemesan,
                                                            status_pembayaran: 1,
                                                            tanggal:
                                                                val.tanggal,
                                                            terkirim:
                                                                val.terkirim,
                                                            ukuran: val.ukuran,
                                                            no_transaksi:
                                                                val.no_transaksi,
                                                        });
                                                    }}
                                                >
                                                    Bayar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="10"
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

                <input
                    type="checkbox"
                    className="modal-toggle"
                    checked={modalConfig.show}
                />
                <div className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <div className="font-bold mb-3">
                            Detail Data Pesanan
                        </div>
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
                                            value={
                                                modalConfig.data.nama_pemesan
                                            }
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
                                            value={
                                                modalConfig.data.no_transaksi
                                            }
                                            placeholder="Pilih tanggal terlebih dahulu"
                                            type="text"
                                            // value={noTransaksi}
                                        />
                                        <Textarea
                                            label="Alamat"
                                            disabled
                                            value={
                                                modalConfig.data
                                                    .alamat_pengiriman
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
                                                <th className="text-center">
                                                    No
                                                </th>
                                                <th className="text-center">
                                                    Nama Barang
                                                </th>
                                                <th className="text-center">
                                                    Qty
                                                </th>
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
                                                                parseInt(
                                                                    val?.qty
                                                                ) *
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
                {/* Modal Konfirmasi Pembayaran */}
                <input
                    type="checkbox"
                    className="modal-toggle"
                    checked={modalConfigConfirm.show}
                />
                <div className="modal">
                    {console.log(modalConfigConfirm.data)}
                    <div className="modal-box w-4/12 max-w-5xl">
                        <div className="modal-middle mt-3">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <div className="mb-2">
                                        {rupiah(totalModalConfirm)}
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        {modalConfigConfirm?.data?.diskon >
                                        0 ? (
                                            <div className="card-actions justify-end">
                                                <div className="badge badge-outline badge-error">
                                                    {
                                                        modalConfigConfirm?.data
                                                            ?.diskon
                                                    }
                                                    %
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="mt-5">
                                        <b>Metode Pembayaran</b>
                                        <br />
                                        <span>
                                            Pembayaran bisa dilakukan dengan
                                            transfer ke bank BCA
                                        </span>
                                        <br />
                                        <span>No Rekening: 137812210</span>
                                    </div>
                                    <hr />
                                    <div className="form-control w-full mt-3">
                                        <label className="label">
                                            <span className="label-text">
                                                Foto Bukti Pembayaran
                                            </span>
                                        </label>
                                        <input
                                            type="file"
                                            className="file-input file-input-sm file-input-bordered w-full"
                                            name="foto_bulti"
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    foto_bukti:
                                                        e.target.files[0],
                                                    status_pembayaran: 1,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-3">
                                    <div
                                        className="btn btn-secondary btn-outline btn-sm"
                                        onClick={() =>
                                            setModalConfigConfirm({
                                                ...modalConfigConfirm,
                                                show: false,
                                                data: {},
                                            })
                                        }
                                    >
                                        Batal
                                    </div>
                                    <button className="btn btn-primary btn-sm">
                                        Check Out
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <FooterLayout />
        </>
    );
}
