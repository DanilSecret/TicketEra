"use client";

import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import {yupResolver} from "@hookform/resolvers/yup";
import {CreateTicketFormData, TopicInterface} from "@/app/models/models";
import {useCookies} from "react-cookie";
import {CreateAdminTicket, GetAllTopics} from "@/app/Api/Api";
import {useUserStore} from "@/store/user_store";
import Header from "@/app/components/header";


const validationSchema = Yup.object().shape({
    topic_id: Yup.number().typeError("Выберите тему заявки").required("Выберите тему заявки"),
    title: Yup.string().min(5, 'Заголовок должен содержать минимум 5 символов').required('Заголовок обязателен'),
    description: Yup.string().min(10, 'Описание должно содержать минимум 10 символов').required('Описание обязательно'),
});

export default function CreateTicketForm() {
    const [cookies] = useCookies(["auth_token"]);
    const [message, setMessage] = useState<string | null>(null);
    const [topicData, setTopicData] = useState<TopicInterface[]>([]);
    const router = useRouter();

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema)
    })

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    const onSubmit = async (data: CreateTicketFormData) => {

        try {
            const formattedData: CreateTicketFormData = {...data, topic_id: Number(data.topic_id)};
            const {success, message} = await CreateAdminTicket(formattedData.title, formattedData.description, formattedData.topic_id, cookies.auth_token);

            if (success) {
                router.push('/admin_panel/tickets/');
            } else {
                setMessage(message || "Ошибка создания заявки");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };

    useEffect(() => {
        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push('/sign_in/');

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
            <div className="flex items-center justify-center text-center min-h-screen bg-gray-100 text-black">

                <form onSubmit={handleSubmit(onSubmit)}
                      className="relative w-full max-w-sm bg-white p-6 rounded-lg shadow-md">

                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    onClick={() => router.push('/admin_panel/tickets/')}*/}
                    {/*    className="absolute top-2 left-2 text-gray-600 border-2 border-solid hover:border-black p-2 rounded-full bg-white shadow"*/}
                    {/*    aria-label="Назад"*/}
                    {/*>*/}
                    {/*    ←*/}
                    {/*</button>*/}


                    <h1 className="text-xl font-semibold text-center mb-4">Создание заявки</h1>

                    <div className="mb-4">
                        <label htmlFor="topic_id" className="block text-sm font-medium text-gray-700">
                            Тема заявки
                        </label>
                        <select
                            {...register("topic_id", {required: true})}
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue=""
                        >
                            <option value="" disabled>Выберите тему</option>
                            {topicData.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                        {errors.topic_id && <p className="text-red-600">{errors.topic_id.message}</p>}

                    </div>


                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Заголовок
                        </label>
                        <input type="text" {...register("title")}
                               placeholder="Заголовок"
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Описание
                        </label>
                        <textarea
                            {...register("description")}
                            placeholder="Описание"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                    </div>

                    <button type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Создать
                        заявку
                    </button>
                    {message && <p className="w-full text-center text-red-600">{message}</p>}
                </form>
            </div>
        </div>
    )
}