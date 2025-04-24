"use client";

import { useState, useEffect } from "react";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "@/app/components/header";
import { CreateUser, GetAllTopics } from "@/app/Api/Api";
import { UserForm } from "@/app/models/models";
import {useUserStore} from "@/store/user_store";
import { useCookies } from "react-cookie";

const schema = yup.object({
    username: yup
        .string()
        .required("Имя пользователя обязательно")
        .min(3, "Имя пользователя должно содержать минимум 3 символа"),
    email: yup
        .string()
        .email("Пожалуйста введите корректный адрес почты")
        .required("Почта обязательна"),
    password: yup
        .string()
        .required("Пароль обязателен")
        .min(4, "Пароль должен содержать минимум 4 символов"),
    role: yup
        .string()
        .required("Выберите роль пользователя"),
    responsibility: yup
        .number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : Number(originalValue)
        )

});

export default function AddUserForm() {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [topicData, setTopicData] = useState<{ id: number; name: string }[]>([]);
    const { register, handleSubmit, formState: { errors } } = useForm<UserForm>({
        resolver: yupResolver(schema),
    });

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);
    const [cookies] = useCookies(["auth_token"]);

    useEffect(() => {
        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push("/sign_in/");
        } else if (userData.role !== "admin") {
            router.push("/");
        } else {
            const allTopics = async () => {
                const response = await GetAllTopics();
                if (response.success && response.result) {
                    setTopicData(response.result);
                } else {
                    setMessage(response.message || "Не удалось загрузить темы");
                }
            };
            allTopics();
        }
    }, [cookies.auth_token, userData, hydrated]);

    const onSubmit = async (data: UserForm) => {
        try {
            const { success, message } = await CreateUser(data.username, data.email, data.role, data.password, cookies.auth_token, data.responsibility);

            if (success) {
                router.push('/admin_panel/users');
            } else {
                setMessage(message || "Ошибка создания пользователя");
            }
        } catch (error) {
            setMessage(`${error}`);
        }

    };

    return (
        <div>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
                >
                    <h1 className="text-xl font-semibold text-center mb-4">Добавление пользователя</h1>

                    {/* Имя пользователя */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            {...register("username")}
                            placeholder="Имя пользователя"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                    </div>

                    {/* Почта */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Почта
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Почта"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                    </div>

                    {/* Пароль */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Пароль
                        </label>
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="Пароль"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                    </div>

                    {/* Роль */}
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Роль
                        </label>
                        <select
                            {...register("role")}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Выберите роль</option>
                            <option value="admin">Администратор</option>
                            <option value="worker">Работник</option>
                            <option value="user">Пользователь</option>
                        </select>
                        {errors.role && <p className="text-red-600">{errors.role.message}</p>}
                    </div>

                    {/* Ответственность */}
                    <div className="mb-4">
                        <label htmlFor="responsibility" className="block text-sm font-medium text-gray-700">
                            Ответственность
                        </label>
                        <select
                            {...register("responsibility")}
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue=""
                        >
                            <option value="" disabled>Выберите ответственность</option>
                            <option value="">Null</option>
                            {topicData.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                        {errors.responsibility && <p className="text-red-600">{errors.responsibility.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                    >
                        Добавить пользователя
                    </button>

                    {message && <p className="w-full text-center text-red-600 mt-2">{message}</p>}
                </form>
            </div>
        </div>
    );
}
