import { useEffect } from "react";
import GuestLayout from "@/Layouts/AuthLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { Textarea } from "../AdminPanel/Components";

export default function Register({ user_data }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: user_data.id ?? "",
        name: user_data.name ?? "",
        email: user_data.email ?? "",
        username: user_data.username ?? "",
        password: user_data.password ?? "",
        level: user_data.level ?? "2",
        alamat: user_data.alamat,
    });

    console.log(user_data);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("user.store"), {
            onSuccess: () => {
                reset();
            },
            onError: () => {},
            onFinish: () => {},
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={handleOnChange}
                        required
                        disabled={true}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        disabled={true}
                        onChange={handleOnChange}
                        required
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={handleOnChange}
                        disabled={true}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <Textarea label="Alamat" value={data.alamat} />

                <div className="flex items-center justify-end mt-4">
                    <Link className="btn btn-outline btn-sm ml-4" href="/">
                        Kembali
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
