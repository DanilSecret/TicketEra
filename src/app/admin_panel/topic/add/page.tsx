"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCookies } from "react-cookie";
import { useUserStore } from "@/store/user_store";
import Header from "@/app/components/header";
import { CreateTopic } from "@/app/Api/Api";
import { TopicInterface } from "@/app/models/models";

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Название темы должно быть не короче 2 символов")
        .required("Название обязательно"),
});

export default function CreateTopicForm() {
    const [cookies] = useCookies(["auth_token"]);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<Pick<TopicInterface, "name">>({
        resolver: yupResolver(validationSchema),
    });


    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    const onSubmit = async (data: { name: string }) => {
        try {
            const response = await CreateTopic(data.name, cookies.auth_token);
            if (response.success) {
                router.push("/admin_panel/topic/");
            } else {
                setMessage(response.message || "Ошибка создания темы");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };

    if (!hydrated || !cookies.auth_token || userData === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="relative w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
                >
                    <h1 className="text-xl font-semibold text-center mb-4">Создание темы</h1>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Название темы
                        </label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Например: Разработка"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                    >
                        Создать тему
                    </button>

                    {message && <p className="w-full text-center text-red-600 mt-2">{message}</p>}
                </form>
            </div>
        </div>
    );
}
