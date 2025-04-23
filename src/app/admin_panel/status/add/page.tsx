"use client";

import {useForm} from "react-hook-form";
import {useState} from "react";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import {yupResolver} from "@hookform/resolvers/yup";
import {useCookies} from "react-cookie";
import {useUserStore} from "@/store/user_store";
import Header from "@/app/components/header";
import { CreateStatus } from "@/app/Api/Api";
import { StatusEInterface } from "@/app/models/models";


const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Название статуса должно быть не короче 2 символов').required('Название обязательно'),
    color: Yup.string().matches(/^#([0-9a-f]{3}){1,2}$/i, 'Цвет должен быть в формате HEX (#RRGGBB)').required('Цвет обязателен'),
    visible: Yup.boolean().required(),
});

export default function CreateStatusForm() {
    const [cookies] = useCookies(["auth_token"]);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema)
    });

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    const onSubmit = async (data: StatusEInterface) => {
        try {
            const response = await CreateStatus(data.name, data.color, data.visible, cookies.auth_token);

            if (response.success) {
                router.push('/admin_panel/status/');
            } else {
                setMessage(response.message || "Ошибка создания статуса");
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

    if (!cookies.auth_token || userData === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <Header/>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">

                <form onSubmit={handleSubmit(onSubmit)}
                      className="relative w-full max-w-sm bg-white p-6 rounded-lg shadow-md">

                    <h1 className="text-xl font-semibold text-center mb-4">Создание статуса</h1>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Название статуса
                        </label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Например: Новый"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                            Цвет (HEX)
                        </label>
                        <input
                            type="text"
                            {...register("color")}
                            placeholder="#00FF00"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.color && <p className="text-red-600">{errors.color.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="visible" className="block text-sm font-medium text-gray-700">
                            Видимость
                        </label>
                        <select
                            {...register("visible")}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue="true"
                        >
                            <option value="true">Да (видим)</option>
                            <option value="false">Нет (скрыт)</option>
                        </select>
                        {errors.visible && <p className="text-red-600">{errors.visible.message}</p>}
                    </div>

                    <button type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
                        Создать статус
                    </button>

                    {message && <p className="w-full text-center text-red-600 mt-2">{message}</p>}
                </form>
            </div>
        </div>
    );
}
