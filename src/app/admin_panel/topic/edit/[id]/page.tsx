"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { useUserStore } from "@/store/user_store";
import { TopicFormData } from "@/app/models/models";
import { GetTopicById, UpdateTopic } from "@/app/Api/Api";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "@/app/components/header";

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Название темы должно быть не короче 2 символов')
        .required('Название обязательно'),
});

export default function EditTopicPage() {
    const params = useParams();
    const id = Number(params?.id);
    const [cookies] = useCookies(["auth_token"]);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TopicFormData>({
        resolver: yupResolver(validationSchema),
    });

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    useEffect(() => {
        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push("/sign_in/");
        } else if (userData.role !== "admin") {
            router.push("/");
        } else {
            const fetchTopic = async () => {
                const response = await GetTopicById(id);
                if (response.success) {
                    reset({ name: response.result[0].name });
                } else {
                    setMessage(response.message || "Ошибка при загрузке темы");
                }
            };
            fetchTopic();
        }
    }, [cookies.auth_token, userData, hydrated, id, reset]);

    const onSubmit = async (data: TopicFormData) => {
        try {
            const response = await UpdateTopic(id, data.name, cookies.auth_token);
            if (response.success) {
                router.push("/admin_panel/topic/");
            } else {
                setMessage(response.message || "Ошибка обновления темы");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };

    if (!hydrated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex items-center justify-center h-screen bg-gray-100 text-black">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold text-center mb-4">Редактирование темы</h1>

                    {message && <p className="text-red-600 text-center">{message}</p>}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Название темы</label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Например: Веб-разработка"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                    >
                        Сохранить изменения
                    </button>
                </form>
            </div>
        </div>
    );
}
