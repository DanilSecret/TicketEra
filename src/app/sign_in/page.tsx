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
        <div className="bg-[#03062c] h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex justify-center items-center px-4 md:px-0">
                <form onSubmit={handleSubmit(onSubmit)}
                      className="w-full max-w-sm p-6 rounded-lg shadow-md bg-[#101025] border border-blue-500 rounded-[10px] shadow-md flex flex-col justify-between">
                    <h1 className="text-xl font-semibold text-center mb-4">Авторизация</h1>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-white">
                            Имя пользователя
                        </label>
                        <input type="text" {...register("username")}
                               placeholder="Имя пользователя"
                               className="bg-white mt-1 block w-full px-3 py-2 border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 text-black"
                        />
                        {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Пароль
                        </label>
                        <input type="password" {...register("password")}
                               placeholder="Пароль"
                               className="bg-white mt-1 block w-full px-3 py-2 border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 text-black"
                        />
                        {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                    </div>

                    <button type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-6">
                        Авторизироваться
                    </button>

                    <p className="text-sm text-white mt-4 text-center">
                        Вы впервые на нашем сайте?{" "}
                        <a href="/sign_up/" className="text-blue-400 hover:text-blue-600 underline">
                            Зарегистрируйтесь
                        </a>
                    </p>

                    {message && <p className="w-full text-center text-red-600 mt-2">{message}</p>}
                </form>
            </div>
        </div>
    );
}
