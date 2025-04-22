"use client";

import {useForm} from "react-hook-form";
import {useState} from "react";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {LoginFormData} from "../models/models";
import {AuthUser} from "../Api/Api";
import {useUserStore} from "@/store/user_store";
import Header from "@/app/components/header";

const validationSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Имя пользователя должно содержать минимум 3 символа').required('Имя пользователя обязательно'),
    password: Yup.string().min(4, 'Пароль должен содержать минимум 4 символов').required('Пароль обязателен'),
});

export default function Login_form() {
    const [message, setMessage] = useState<string | null>(null);
    const {setUserData, setIsAuth} = useUserStore();

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = async (data: LoginFormData) => {

        try {
            const {success, message, result} = await AuthUser(data.username, data.password);
            if (success) {
                setIsAuth(true)
                setUserData(result.rows[0])
                window.location.href = '/';
            } else {
                setMessage(message || "Ошибка авторизации");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };

    return (
        <div>
            <Header/>
            <div className="flex items-center justify-center text-center min-h-screen bg-gray-100 text-black">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold text-center mb-4">Авторизация</h1>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Имя пользователя
                        </label>
                        <input type="text" {...register("username")}
                               placeholder="Имя пользователя"
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Пароль
                        </label>
                        <input type="password" {...register("password")}
                               placeholder="Пароль"
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                    </div>

                    <button type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Авторизироваться
                    </button>
                    {message && <p className="w-full text-center text-red-600">{message}</p>}
                </form>
            </div>
        </div>
    )
}