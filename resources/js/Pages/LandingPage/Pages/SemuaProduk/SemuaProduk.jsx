import React, { useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { router, useForm } from "@inertiajs/react";
import { FooterLayout, NavbarLayout } from "../../Layouts";
import { Alert, Input, Textarea } from "@/Pages/AdminPanel/Components";

const SemuaProduk = ({ barang_data, user, keranjang }) => {
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

    const dataUkuran = [
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [qty, setQty] = useState(0);

    const { data, setData, post, put, processing, errors, reset, progress } =
        useForm({
            nama_pemesan: user?.name,
            alamat_pengiriman: "",
            keterangan: "-",
            tanggal: new Date().toISOString().slice(0, 10),
            is_online: 1,
            terkirim: 0,
            ukuran: "",
            foto_bukti: "",
            status_pembayaran: 0,
            detail: [],
        });

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/pesanan", {
            onSuccess: () => {
                setAlertConfig({
                    ...alertConfig,
                    show: true,
                    type: "success",
                    text: "Barang dipesan",
                });
                setModalConfig({ show: false });
                setModalConfigConfirm({ show: false });
                reset();
            },
            onError: () => {},
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    const handleAddToChart = () => {
        const finalValues = {
            id_barang: modalConfig?.data?.id,
            id_customer: user?.id,
            qty: qty,
            ukuran: data.ukuran,
        };

        router.post("/admin/keranjang", finalValues, {
            onSuccess: () => {
                setAlertConfig({
                    ...alertConfig,
                    show: true,
                    type: "success",
                    text: "Barang ditambah ke keranjang",
                });
                setModalConfig({ show: false });
                reset();
            },
            onError: () => {},
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    const handleSearch = (query) => {
        router.get(
            "/semua-produk",
            { key: query },
            {
                preserveState: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            }
        );
    };
    return (
        <div className="w-full py-8">
            <NavbarLayout
                user={user}
                dataKeranjang={keranjang}
                setAlertConfig={setAlertConfig}
                alertConfig={alertConfig}
            />
            <div className="max-w-7xl my-4 mx-auto">
                <div className="mx-6">
                    {alertConfig.show && (
                        <Alert
                            type={alertConfig.type}
                            text={alertConfig.text}
                        />
                    )}
                    <div className="form-control">
                        <input
                            type="text"
                            placeholder="Cari Produk"
                            className="input input-bordered w-full"
                            name="key"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-center flex-col lg:flex-row lg:flex-wrap lg:items-stretch items-center gap-4 mt-4 mx-6">
                    {isLoading ? (
                        <div className="text-center">
                            <ImSpinner8 className="animate-spin text-7xl" />
                        </div>
                    ) : (
                        barang_data.data.map((val, ind) => (
                            <div
                                className="card card-compact w-full lg:w-72 bg-base-100 shadow-xl"
                                key={ind}
                            >
                                <figure>
                                    <img
                                        src={`http://127.0.0.1:8000/storage/${val.foto_barang}`}
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {val.nama_barang}
                                    </h2>
                                    <p>
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(val.harga)}
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        <div className="card-actions justify-end">
                                            <div className="badge badge-outline badge-primary">
                                                {
                                                    val.kategori
                                                        .nama_kategori_barang
                                                }
                                            </div>
                                        </div>
                                        {val.diskon > 0 ? (
                                            <div className="card-actions justify-end">
                                                <div className="badge badge-outline badge-error">
                                                    {val.diskon} %
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="card-actions justify-center">
                                        <button
                                            className="btn w-full"
                                            onClick={() => {
                                                const dataDetail = {
                                                    ...val,
                                                    sub_total: parseInt(
                                                        val.harga -
                                                            parseFloat(
                                                                val.diskon / 100
                                                            ) *
                                                                parseInt(
                                                                    val.harga
                                                                )
                                                    ),
                                                };
                                                setModalConfig({
                                                    show: true,
                                                    data: val,
                                                });
                                                setData({
                                                    ...data,
                                                    detail: [dataDetail],
                                                });
                                            }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <input
                type="checkbox"
                className="modal-toggle"
                checked={modalConfig.show}
            />

            {/* Modal Belanja */}
            <div className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <div className="modal-middle mt-3">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-3">
                                <img
                                    src={`http://127.0.0.1:8000/storage/${modalConfig?.data?.foto_barang}`}
                                />
                                <div>
                                    <div className="text-lg">
                                        <b>{modalConfig?.data?.nama_barang}</b>
                                    </div>
                                    <div className="mb-2">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(modalConfig?.data?.harga)}
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        <div className="card-actions justify-end">
                                            <div className="badge badge-outline badge-primary">
                                                {
                                                    modalConfig?.data?.kategori
                                                        ?.nama_kategori_barang
                                                }
                                            </div>
                                        </div>
                                        {modalConfig?.data?.diskon > 0 ? (
                                            <div className="card-actions justify-end">
                                                <div className="badge badge-outline badge-error">
                                                    {modalConfig?.data?.diskon}%
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="flex">
                                        <Input
                                            type="number"
                                            placeholder="Masukan jumlah barang"
                                            onChange={(val) => {
                                                const dataDetail =
                                                    data.detail.map((res) => {
                                                        const sumWithQty =
                                                            parseInt(
                                                                val.target.value
                                                            ) *
                                                            parseInt(res.harga);

                                                        const subTotal =
                                                            parseInt(
                                                                sumWithQty -
                                                                    parseFloat(
                                                                        res.diskon /
                                                                            100
                                                                    ) *
                                                                        parseInt(
                                                                            sumWithQty
                                                                        )
                                                            );
                                                        return {
                                                            ...res,
                                                            qty: val.target
                                                                .value,
                                                            sub_total: subTotal,
                                                        };
                                                    });

                                                setData({
                                                    ...data,
                                                    detail: dataDetail,
                                                });
                                                setQty(val?.target?.value);
                                            }}
                                        />
                                    </div>

                                    <Textarea
                                        placeholder="Masukan alamat pengiriman"
                                        name="alamat_pengiriman"
                                        onChange={handleOnChange}
                                    />
                                    <div className="mt-2">
                                        <span>Ukuran</span>
                                    </div>
                                    <div className="flex gap-5">
                                        {dataUkuran.map((val) => (
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <span className="label-text mr-4">
                                                        {val.label}
                                                    </span>
                                                    <input
                                                        type="radio"
                                                        name="radio-10"
                                                        className="radio"
                                                        onChange={() =>
                                                            setData({
                                                                ...data,
                                                                ukuran: val.value,
                                                            })
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                                <div
                                    className="btn btn-secondary btn-outline btn-sm"
                                    onClick={() =>
                                        setModalConfig({
                                            ...modalConfig,
                                            show: false,
                                        })
                                    }
                                >
                                    Batal
                                </div>
                                <div
                                    className="btn btn-success btn-outline btn-sm"
                                    onClick={() =>
                                        handleAddToChart(data?.detail)
                                    }
                                >
                                    Tambah Ke Keranjang
                                </div>
                                <div
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        setModalConfigConfirm({
                                            ...modalConfigConfirm,
                                            show: true,
                                            data: modalConfig.data,
                                        })
                                    }
                                >
                                    Check Out
                                </div>
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
                <div className="modal-box w-11/12 max-w-5xl">
                    <div className="modal-middle mt-3">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-3">
                                <img
                                    src={`http://127.0.0.1:8000/storage/${modalConfigConfirm?.data?.foto_barang}`}
                                />
                                <div>
                                    <div className="text-lg">
                                        <b>
                                            {
                                                modalConfigConfirm?.data
                                                    ?.nama_barang
                                            }
                                        </b>
                                    </div>
                                    <div className="mb-2">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(
                                            modalConfigConfirm?.data?.harga
                                        )}
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        <div className="card-actions justify-end">
                                            <div className="badge badge-outline badge-primary">
                                                {
                                                    modalConfigConfirm?.data
                                                        ?.kategori
                                                        ?.nama_kategori_barang
                                                }
                                            </div>
                                        </div>
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
            <FooterLayout />
        </div>
    );
};

export default SemuaProduk;
