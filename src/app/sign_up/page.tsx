"use client";

import {useState} from "react";
import * as yup from "yup";
import {useRouter} from "next/navigation";
import RegisterUser from "../Api/Api";
import {RegisterFormData} from "../models/models";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Header from "@/app/components/header";


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
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const {success, message} = await RegisterUser(data.username, data.password, data.email);

            if (success) {
                router.push('/sign_in/');
            } else {
                setMessage(message || "Ошибка авторизации");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };

    return (
        <div className="bg-[#03062c] h-screen flex flex-col">
            <Header/>
            <div className="flex-1 flex justify-center items-center px-4 md:px-0">
                <form onSubmit={handleSubmit(onSubmit)}
                      className="w-full max-w-sm p-6 rounded-lg shadow-md bg-[#101025] p-6 border border-blue-500 rounded-[10px] shadow-md flex flex-col justify-between">
                    <h1 className="text-xl font-semibold text-center mb-4 ">Регистрация</h1>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-white">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            {...register("username")}
                            className=" bg-white mt-1 block w-full px-3 py-2 border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 text-black"
                        />
                        {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            Почта
                        </label>
                        <input
                            type="email"
                            placeholder="Почта"
                            {...register("email")}
                            className="bg-white mt-1 block w-full px-3 py-2 border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 text-black"
                        />
                        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Пароль
                        </label>
                        <input
                            type="password"
                            placeholder="Пароль"
                            {...register("password")}
                            className=" bg-white mt-1 block w-full px-3 py-2 border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 text-black"
                        />
                        {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                    </div>
                    <div className="mb-4 mt-2">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-white "
                        >
                            Подтверждение пароля
                        </label>
                        <input
                            type="password"
                            placeholder="Подтвердите пароль"
                            {...register("confirmPassword")}
                            className="bg-white mt-1 block w-full px-3 py-2 border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 text-black"
                        />
                        {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
                    </div>
                    <button type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg  hover:bg-blue-600 mt-6">Зарегистрироваться
                    </button>
                    {message && <p className="w-full text-center text-red-600">{message}</p>}
                </form>
            </div>
        </div>
    );
}
