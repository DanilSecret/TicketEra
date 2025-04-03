"use client";

import { useEffect, useState } from "react";
import {ChangeTicketStatus, GetAllStatus, GetTicketById} from "@/app/Api/Api";
import {ChangeStatusFormData, StatusInterface, TicketInterface} from "@/app/models/models";
import { useParams } from "next/navigation";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";


const validationSchema = Yup.object().shape({
    status_id: Yup.number().typeError("Выберите статус заявки").required("Выберите статус заявки"),

});


export default function TicketPage() {
    const params = useParams();
    const router = useRouter();
    const [cookies] = useCookies(["auth_token"]);

    const [ticket, setTicket] = useState<TicketInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [statusData, setStatusData] = useState<StatusInterface[]>([]);
    const { register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (!params || !params.id) return;

        const fetchTicket = async () => {
            setLoading(true);
            const response = await GetTicketById(params.id as string);

            if (response.success && response.result) {
                setTicket(response.result[0]);
            } else {
                setError(response.message || "Не удалось загрузить заявку");
            }
            setLoading(false);
        };

        const fetchallStatus = async () => {
            const response = await GetAllStatus();
            if (response.success && response.result) {
                setStatusData(response.result);
            } else {
                setMessage(response.message || "Не удалось загрузить статусы");
            }
        };
        fetchTicket();
        fetchallStatus();
    }, [params]);

    const onSubmit = async (data: ChangeStatusFormData) => {
        if (!params || !params.id) return;
        try {
            const formattedData: ChangeStatusFormData = {...data, status_id: Number(data.status_id)};
            const { success, message } = await ChangeTicketStatus(params.id as string, formattedData.status_id, cookies.auth_token);

            if (success) {
                router.push('/user_profile/');
            } else {
                setMessage(message || "Ошибка создания заявки");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };


    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
            <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6 h-auto max-h-[80vh] overflow-auto">
                <h1 className="text-3xl font-bold text-black text-center mb-6">Заявка</h1>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center text-lg">{error}</p>
                ) : ticket ? (
                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-300">

                        <div className="flex flex-col md:flex-row justify-normal md:justify-between mb-2">
                            <p className="text-gray-600">
                                <strong>Статус:</strong>
                                <span
                                    className="px-3 py-1 ml-2 rounded-full text-white bg-blue-600 text-sm font-medium">
                                    {ticket.status_id}
                                </span>
                            </p>
                            <p className="text-gray-600 text-base">
                                <strong>Дата: </strong>
                                {ticket.create_at ? new Date(ticket.create_at).toLocaleString("ru-RU", {
                                    dateStyle: 'long',
                                    timeStyle: 'short'
                                }) : "Неизвестно"}
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold text-black mb-3">{ticket.title}</h2>
                        <p className="text-gray-600 text-base mb-4 text-wrap break-words">{ticket.description}</p>

                        <div className="mt-3 text-sm text-gray-600">
                            <p><strong>Тема:</strong> {ticket.topic_id}</p>
                            <p><strong>Автор:</strong> {ticket.author} <span className="ml-9"></span>
                                <strong>Почта:</strong> {ticket.author_email}</p>

                            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex items-center space-x-4 ">
                                <select
                                    {...register("status_id", {required: true})}
                                    className="mt-1 block w-full px-3 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    defaultValue="1"
                                >
                                    {statusData.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    type="submit"
                                >
                                    Сменить статус
                                </button>
                                {errors.status_id && <p className="text-red-600">{errors.status_id.message}</p>}
                            </form>
                            {message && <p className="w-full text-center text-red-600">{message}</p>}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700 text-center text-lg">Заявка не найдена.</p>
                )}
            </div>
        </div>
    );
}
