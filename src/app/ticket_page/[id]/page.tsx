"use client";

import {useEffect, useState} from "react";
import {ChangeTicketStatus, GetAllStatus, GetTicketById} from "@/app/Api/Api";
import {ChangeStatusFormData, StatusInterface, TicketInterface} from "@/app/models/models";
import {useParams} from "next/navigation";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import {useCookies} from "react-cookie";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {useUserStore} from "@/store/user_store";
import Header from "@/app/components/header";


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
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema)
    })
    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    useEffect(() => {
        if (!params || !params.id) return;

        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push("/sign_in/");

        } else {
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
        }

    }, [params, cookies.auth_token, userData, hydrated]);

    const onSubmit = async (data: ChangeStatusFormData) => {
        if (!params || !params.id) return;
        try {
            const formattedData: ChangeStatusFormData = {...data, status_id: Number(data.status_id)};
            const {
                success,
                message
            } = await ChangeTicketStatus(params.id as string, formattedData.status_id, cookies.auth_token);

            if (success) {
                router.push('/tickets_list/');
            } else {
                setMessage(message || "Ошибка создания заявки");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };


    return (
        <div className="bg-[#03062c] min-h-screen flex flex-col">
            <Header/>
            <div className="flex-1 flex justify-center items-center px-4 md:px-0">
                <div className="w-full max-w-xl shadow-md rounded-lg p-6 h-auto max-h-[80vh] overflow-auto bg-[#101025] border border-blue-500">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">Заявка</h1>
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div
                                className="border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 text-center text-lg">{error}</p>
                    ) : ticket ? (
                        <div className="bg-[#1a1d45] p-5 rounded-lg shadow-sm border border-blue-500">

                            <div className="flex flex-col md:flex-row justify-normal md:justify-between mb-2">
                                <p className="text-white">
                                    <strong>Статус:</strong>
                                    <span
                                        className="px-3 py-1 ml-2 rounded-full text-white text-sm font-medium"
                                        style={{backgroundColor: ticket.status_color}}>
                                    {ticket.status_id}
                                </span>
                                </p>
                                <p className="text-white text-base">
                                    <strong>Дата: </strong>
                                    {ticket.create_at ? new Date(ticket.create_at).toLocaleString("ru-RU", {
                                        dateStyle: 'long',
                                        timeStyle: 'short'
                                    }) : "Неизвестно"}
                                </p>
                            </div>

                            <h2 className="text-xl font-semibold text-white mb-3">{ticket.title}</h2>
                            <p className="text-white text-base mb-4 text-wrap break-words">{ticket.description}</p>

                            <div className="mt-3 text-sm text-white">
                                <p><strong>Тема:</strong> {ticket.topic_id}</p>
                                <p><strong>Автор:</strong> {ticket.author} <span className="ml-9"></span>
                                    <strong>Почта:</strong> {ticket.author_email}</p>
                                {userData?.role === "admin" || userData?.role === "worker" ? (
                                    <form onSubmit={handleSubmit(onSubmit)}
                                          className="mt-4 flex items-center space-x-4 ">
                                        <select
                                            {...register("status_id", {required: true})}
                                            className="mt-1 block w-full px-3 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black"
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
                                ) : (
                                    <></>
                                )}
                                {message && <p className="w-full text-center text-red-600">{message}</p>}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center text-lg">Заявка не найдена.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
