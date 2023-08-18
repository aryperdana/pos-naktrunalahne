import { Link, Head } from "@inertiajs/react";
import { FooterLayout, NavbarLayout } from "../Layouts";

export default function Welcome({ auth }) {
    console.log(auth);
    return (
        <>
            <Head title="NAKTRUNALAHNE" />
            <div className="w-full py-8">
                {/* Navbar section */}
                <NavbarLayout user={auth?.user?.name} userId={auth?.user?.id} />
                {/* Banner diskon */}
                <div className="alert alert-info max-w-7xl mx-auto my-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-info shrink-0 w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    <div>
                        <h3 className="font-bold">Diskon!</h3>
                        <div className="text-xs">Lihat diskon hari ini!!!</div>
                    </div>
                    <Link
                        href="/diskon-produk"
                        className="btn btn-ghost btn-sm"
                    >
                        lihat
                    </Link>
                </div>
                {/* Hero Section */}
                <div
                    className="hero h-96 max-w-7xl mx-auto my-4"
                    style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1627974158587-78602bcc87f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`,
                    }}
                >
                    <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content text-center text-neutral-content">
                        <div className="max-w-md">
                            <h1 className="mb-5 text-5xl font-bold">
                                Hello Semuanya
                            </h1>
                            <p className="mb-5">
                                Disini kami menjual berbagai busana adat bali.
                                Dimulai dari udeng, baju, saput, kamen semua
                                ada.
                            </p>
                            <Link
                                href={
                                    Boolean(auth?.user)
                                        ? "/semua-produk"
                                        : "/register"
                                }
                                className="border border-neutral-100 px-4 py-2 rounded-sm hover:bg-black hover:border-none"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className="max-w-7xl mx-auto flex justify-between gap-4">
                    <div className="group relative">
                        <img
                            className="w-full object-cover"
                            src="https://cdn.pixabay.com/photo/2016/11/19/15/40/clothes-1839935_960_720.jpg"
                        />
                        <div className="absolute top-48 left-44">
                            <h1 className="text-white text-4xl font-bold">
                                Produk Terbaru
                            </h1>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-0 flex flex-col justify-center items-center bg-black opacity-0 group-hover:h-full group-hover:opacity-90 duration-500">
                            <h1 className="text-2xl text-white">
                                Lihat Produk Terbaru
                            </h1>
                            <Link
                                className="mt-5 px-8 py-3 rounded-full btn btn-outline btn-primary duration-300"
                                href="/produk-terbaru"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                    <div className="group relative">
                        <img
                            className="w-full object-cover"
                            src="https://cdn.pixabay.com/photo/2016/11/19/15/40/clothes-1839935_960_720.jpg"
                        />
                        <div className="absolute top-48 left-44">
                            <h1 className="text-white text-4xl font-bold">
                                Semua Produk
                            </h1>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-0 flex flex-col justify-center items-center bg-black opacity-0 group-hover:h-full group-hover:opacity-90 duration-500">
                            <h1 className="text-2xl text-white">
                                Lihat Semua Produk Kami
                            </h1>
                            <Link
                                className="mt-5 px-8 py-3 rounded-full btn btn-outline btn-primary duration-300"
                                href="/semua-produk"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <FooterLayout />
        </>
    );
}
