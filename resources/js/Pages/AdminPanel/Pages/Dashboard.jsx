import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import MainLayout from "../Layouts";
import { TbCategory2 } from "react-icons/tb";
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from "react-icons/hi";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Penjualan Bulan Ini",
        },
    },
};

const totalDays = new Date(
    new Date().getFullYear(),
    parseInt(new Date().getMonth() + 1),
    0
).getDate();

const labels = Array.from({ length: totalDays }, (_, i) => i + 1);

export default function Dashboard({
    dataDetail,
    totalBarangByKategori,
    totalOnline,
    totalOffline,
}) {
    const mappingDataDetail = dataDetail.map((res) => ({
        tanggal: new Date(res.tanggal).getDate(),
        total: res.total,
    }));

    const dataSet = labels.map((item1) => {
        return (
            mappingDataDetail.find((item2) => item2.tanggal === item1)?.total ??
            0
        );
    });
    const data = {
        labels,
        datasets: [
            {
                label: new Date().toLocaleString("id-ID", { month: "long" }),
                data: dataSet,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    };

    console.log(totalOffline);

    return (
        <>
            <MainLayout title="Dashboard" navbarTitle="Dashboard">
                <div className="card w-full bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Dashboard</h2>
                    </div>
                </div>
                <div className="flex gap-3 w-full">
                    {totalBarangByKategori?.map((val) => (
                        <div className="card w-3/12 max-w-4xl bg-base-100 shadow-sm mt-10">
                            <div className="card-body p-3">
                                <h2 className="card-title flex justify-between">
                                    <TbCategory2 color="blue" />
                                    {val?.kategori?.nama_kategori_barang}
                                </h2>
                                <hr />
                                <div className="flex justify-between">
                                    <b>Total</b>
                                    <small>
                                        <b>{rupiah(val?.total)}</b>
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-3">
                    <div className="card w-6/12 bg-base-100 shadow-sm mt-10">
                        <div className="card-body">
                            <Line options={options} data={data} />
                        </div>
                    </div>
                    <div className="card w-3/12 max-w-4xl h-1/3 bg-base-100 shadow-sm mt-10">
                        <div className="card-body p-3">
                            <h2 className="card-title flex justify-between">
                                <HiOutlineStatusOnline color="green" />
                                Penjualan Online
                            </h2>
                            <hr />
                            <div className="flex justify-between">
                                <b>Total</b>
                                <small>
                                    <b>{rupiah(totalOnline[0]?.total)}</b>
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="card w-3/12 max-w-4xl h-1/3 bg-base-100 shadow-sm mt-10">
                        <div className="card-body p-3">
                            <h2 className="card-title flex justify-between">
                                <HiOutlineStatusOffline color="red" />
                                Penjualan Offline
                            </h2>
                            <hr />
                            <div className="flex justify-between">
                                <b>Total</b>
                                <small>
                                    <b>{rupiah(totalOffline[0]?.total)}</b>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
