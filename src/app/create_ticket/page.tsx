"use client";

import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import {yupResolver} from "@hookform/resolvers/yup";
import {CreateTicketFormData, TopicInterface} from "@/app/models/models";
import {useCookies} from "react-cookie";
import {CreateTicket, GetAllTopics} from "@/app/Api/Api";
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
            const {
                success,
                message
            } = await CreateTicket(formattedData.title, formattedData.description, formattedData.topic_id, cookies.auth_token);

            if (success) {
                router.push('/');
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
        <div className="bg-[#03062c] h-screen flex flex-col">
            <Header/>
            <div className="flex-1 flex justify-center items-center px-4 md:px-0">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md md:max-w-lg min-h-[550px] bg-[#101025] p-6 border border-blue-500 rounded-[10px] shadow-md flex flex-col justify-between"
                >
                    <h1 className="text-xl font-semibold text-center mb-2 ">Создание заявки</h1>

                    <div className="mb-2">
                        <label htmlFor="topic_id" className="block text-sm font-medium text-white">
                            Тема заявки
                        </label>
                        <select
                            {...register("topic_id", {required: true})}
                            className="mt-1 block w-full px-4 py-3 text-base bg-white text-black border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600"
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


                    <div className="mb-2">
                        <label htmlFor="title" className="block text-sm font-medium text-white">
                            Заголовок
                        </label>
                        <input
                            type="text"
                            {...register("title")}
                            placeholder="Заголовок"
                            className="mt-1 block w-full px-4 py-3 text-base bg-white text-black border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600"
                        />
                        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="description" className="block text-sm font-medium text-white">
                            Описание
                        </label>
                        <textarea
                            {...register("description")}
                            placeholder="Описание"
                            className="mt-1 block w-full px-4 py-3 text-base bg-white text-black border-2 border-blue-500 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600"
                        />
                        {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                    </div>

                    <button type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg ">Создать
                        заявку
                    </button>
                    {message && <p className="w-full text-center text-red-600">{message}</p>}
                </form>
            </div>
        </div>
    )
}