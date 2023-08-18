import React, { useEffect, useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { RiUser3Fill } from "react-icons/ri";
import Checkbox from "@/Components/Checkbox";
import { Textarea } from "@/Pages/AdminPanel/Components";

const ChartShoping = ({
    dataKeranjang,
    name,
    setAlertConfig,
    alertConfig,
    setModalConfig,
    modalConfig,
}) => {
    const [modalConfigConfirm, setModalConfigConfirm] = useState({
        data: {},
        show: false,
    });
    const { data, setData, reset, post } = useForm({
        nama_pemesan: name,
        alamat_pengiriman: "",
        keterangan: "-",
        tanggal: new Date().toISOString().slice(0, 10),
        is_online: 1,
        terkirim: 0,
        ukuran: "",
        foto_bukti: "",
        detail: [],
    });

    const total =
        dataKeranjang &&
        dataKeranjang.reduce(
            (acc, curr) =>
                acc +
                curr.qty *
                    curr.barang.harga *
                    ((100 - curr.barang.diskon) / 100),
            0
        );

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const checkboxHandler = (e, val) => {
        const sumWithQty = parseInt(val.qty) * parseInt(val?.barang?.harga);

        const subTotal = parseInt(
            sumWithQty -
                parseFloat(val.barang.diskon / 100) * parseInt(sumWithQty)
        );

        const finalValues = {
            id_keranjang: val.id,
            id: val.id_barang,
            qty: val.qty,
            id_customer: val.id_customer,
            is_checkout: 1,
            sub_total: subTotal,
        };

        if (e?.target?.checked) {
            setData({
                ...data,
                ukuran: val?.ukuran,
                detail: [...data.detail, finalValues],
            });
        }
        if (!e?.target?.checked) {
            const removeData = data.detail.filter(
                (item) => item.id_keranjang !== val.id
            );
            setData({
                ...data,
                detail: removeData,
            });
        }
    };

    const handleSubmit = (e) => {
        const finalValues = data?.detail?.map((val) => ({
            id: val.id_keranjang,
            id_barang: val.id,
            id_customer: val.id_customer,
            qty: val.qty,
            is_checkout: 1,
        }));
        e.preventDefault();

        post("/admin/pesanan", {
            onSuccess: () => {},
            onError: () => {},
            onFinish: () => {
                router.put("/admin/keranjang/update", finalValues);
                setModalConfig({ show: false });
                setAlertConfig({
                    ...alertConfig,
                    show: true,
                    type: "success",
                    text: "Barang dipesan",
                });
                setModalConfigConfirm({ show: false });
                reset();
            },
        });
    };

    return (
        <div>
            <input
                type="checkbox"
                id="my-modal"
                checked={modalConfig?.show}
                className="modal-toggle"
            />
            <div className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <div className="text-center">
                        <b>Keranjang Belanja</b>
                    </div>
                    <hr className="mt-4 mb-4" />
                    <form onSubmit={handleSubmit}>
                        <Textarea
                            placeholder="Masukan alamat pengiriman"
                            name="alamat_pengiriman"
                            onChange={handleOnChange}
                        />
                        <div className="overflow-x-auto mt-4">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Gambar</th>
                                        <th>Nama Barang</th>
                                        <th>Qty</th>
                                        <th>Diskon</th>
                                        <th>Harga Barang</th>
                                        <td>SubTotal</td>
                                        <td>Pilih</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataKeranjang &&
                                    dataKeranjang.length > 0 ? (
                                        <>
                                            {dataKeranjang.map((val, ind) => {
                                                const subTotal =
                                                    parseInt(val.qty ?? 0) *
                                                    parseInt(
                                                        val.barang.harga ?? 0
                                                    ) *
                                                    ((100 -
                                                        parseInt(
                                                            val?.barang
                                                                ?.diskon ?? 0
                                                        )) /
                                                        100);
                                                return (
                                                    <tr>
                                                        <td width="20">
                                                            {ind + 1}
                                                        </td>
                                                        <td width="150">
                                                            <figure className="p-0">
                                                                <img
                                                                    src={`http://127.0.0.1:8000/storage/${val.barang.foto_barang}`}
                                                                />
                                                            </figure>
                                                        </td>
                                                        <td>
                                                            {
                                                                val?.barang
                                                                    ?.nama_barang
                                                            }
                                                        </td>
                                                        <td>{val.qty}</td>
                                                        <td>
                                                            {val?.barang
                                                                ?.diskon + " %"}
                                                        </td>
                                                        <td>
                                                            {new Intl.NumberFormat(
                                                                "id-ID",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "IDR",
                                                                }
                                                            ).format(
                                                                val?.barang
                                                                    ?.harga
                                                            )}
                                                        </td>
                                                        <td>
                                                            {new Intl.NumberFormat(
                                                                "id-ID",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "IDR",
                                                                }
                                                            ).format(subTotal)}
                                                        </td>
                                                        <td>
                                                            <Checkbox
                                                                name={`checkbox_${val?.id}`}
                                                                onChange={(e) =>
                                                                    checkboxHandler(
                                                                        e,
                                                                        val
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            <tr>
                                                <th
                                                    colSpan="6"
                                                    className="text-right"
                                                >
                                                    Total :
                                                </th>
                                                <th>
                                                    {new Intl.NumberFormat(
                                                        "id-ID",
                                                        {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }
                                                    ).format(total)}
                                                </th>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <th
                                                colSpan="8"
                                                className="text-center"
                                            >
                                                Tidak Ada Data
                                            </th>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-action">
                            <label
                                className="btn btn-sm"
                                onClick={() => setModalConfig({ show: false })}
                            >
                                Batal
                            </label>
                            <div
                                className="btn btn-sm"
                                onClick={() =>
                                    setModalConfigConfirm({
                                        data: {},
                                        show: true,
                                    })
                                }
                            >
                                Checkout
                            </div>
                        </div>
                    </form>
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
                            <div className="grid gap-3">
                                <div>
                                    <b>Metode Pembayaran</b>
                                    <hr />
                                    <div>
                                        <br />
                                        <span>
                                            Pembayaran bisa dilakukan dengan
                                            transfer ke bank BCA
                                        </span>
                                        <br />
                                        <span>No Rekening: 137812210</span>
                                    </div>

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
        </div>
    );
};

export const NavbarLayout = ({
    user,
    dataKeranjang,
    setAlertConfig,
    alertConfig,
    userId,
}) => {
    const [modalConfig, setModalConfig] = useState({ show: false });

    console.log(user);
    return (
        <div>
            <div className="max-w-7xl mx-auto sticky top-0 z-50">
                <div className="navbar bg-base-100">
                    <div className="flex-1">
                        <Link
                            className="btn btn-ghost normal-case text-xl"
                            href="/"
                        >
                            NAKTRUNALAHNE !!!
                        </Link>
                    </div>
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">
                            <li>
                                <Link href="udeng">Udeng</Link>
                            </li>
                            <li>
                                <Link href="saput">Saput</Link>
                            </li>
                            <li>
                                <Link href="kamen">Kamen</Link>
                            </li>
                            <li>
                                <Link href="baju">Baju</Link>
                            </li>
                            <li>
                                <Link href="history">History</Link>
                            </li>
                            <li>
                                <Link href="pembelian-pending">
                                    Menunggu Pembayaran
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-none">
                        <div className="dropdown dropdown-end">
                            <button
                                tabIndex={0}
                                className="btn btn-ghost btn-circle"
                                htmlFor="my-modal"
                                onClick={() => setModalConfig({ show: true })}
                            >
                                <div className="indicator">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    <span className="badge badge-sm indicator-item">
                                        {dataKeranjang &&
                                        dataKeranjang.length > 0
                                            ? dataKeranjang.length
                                            : 0}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost gap-2">
                            <div>{user?.name}</div>
                            <div className="w-6 h-6 text-black font-bold border border-black rounded-full">
                                <RiUser3Fill className="m-auto align-middle mt-1" />
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li>
                                {!user && (
                                    <>
                                        <Link href="login">Login</Link>
                                        <Link href="register">Register</Link>
                                    </>
                                )}
                                {user && (
                                    <>
                                        <Link
                                            href={"profile-customer/" + userId}
                                        >
                                            Profile
                                        </Link>
                                        <Link href="logout">Logout</Link>
                                    </>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <ChartShoping
                dataKeranjang={dataKeranjang}
                name={user?.name}
                setAlertConfig={setAlertConfig}
                alertConfig={alertConfig}
                setModalConfig={setModalConfig}
                modalConfig={modalConfig}
            />
        </div>
    );
};
