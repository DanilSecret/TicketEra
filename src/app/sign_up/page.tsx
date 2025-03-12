"use client";

import { useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import registerUser from "../Api/Api";
import { RegisterFormData } from "../models/models";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


const schema = yup.object({
    username: yup
        .string()
        .required("Имя пользователя обязательно")
        .min(3, "Имя пользователя должно содержать минимум 3 символа"),
    email: yup
        .string()
        .email('Пожалуйста введите почту')
        .required("Почта обязательна"),
    password: yup
        .string()
        .required("Пароль обязателен")
        .min(4, "Пароль должен содержать минимум 4 символов"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Пароли должны совпадать")
        .required("Необходимо подтвердить пароль"),
});

export default function Sign_form() {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const { success, message} = await registerUser(data.username, data.password, data.email);

            if (success) {
                router.push('/');
            } else {
                setMessage(message || "Ошибка авторизации");
            }
        }catch (error) {
            setMessage("Ошибка входа");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-center mb-4">Регистрация</h1>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Имя пользователя
                    </label>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        {...register("username")}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Почта
                    </label>
                    <input
                        type="email"
                        placeholder="Почта"
                        {...register("email")}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Пароль
                    </label>
                    <input
                        type="password"
                        placeholder="Пароль"
                        {...register("password")}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Подтверждение пароля
                    </label>
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        {...register("confirmPassword")}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Зарегистрироваться
                </button>
                {message && <p className="w-full text-center text-red-600">{message}</p>}
            </form>
        </div>
    );
}
