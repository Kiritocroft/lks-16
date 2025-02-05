"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Password dan konfirmasi password tidak cocok!");
            return;
        }

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "register",
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                alert("Registrasi berhasil! Silakan login.");
                router.push("/login");
            } else {
                const result = await response.json();
                setError(result.error || "Terjadi kesalahan saat registrasi.");
            }
        } catch (err) {
            setError("Gagal terhubung ke server. Coba lagi nanti.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center">Register</h1>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded text-black"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded text-black"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded text-black"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 border rounded text-black"
                    required
                />
                <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded">
                    Register
                </button>
                <p className="text-center">
                    Sudah punya akun?{" "}
                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="text-blue-500 underline"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
}
