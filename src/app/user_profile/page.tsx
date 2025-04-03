"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TicketInterface, UserProfileInterface } from "@/app/models/models";
import { GetTicketsByUser, GetUserProfInf, DeleteTicket } from "@/app/Api/Api";
import dleteimg from "@/app/assets/delete.svg";
import Link from "next/link";
import Image from "next/image";


export default function UserProfile() {
    const [cookies] = useCookies(["auth_token"]);
    const [message, setMessage] = useState<string | null>(null);
    const [umessage, setUMessage] = useState<string | null>(null);
    const [data, setData] = useState<TicketInterface[]>([]);
    const [userdata, setUserdata] = useState<UserProfileInterface | null>(null);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const GetUserTickets = async () => {
            setLoadingTickets(true);
            const response = await GetTicketsByUser(cookies.auth_token);

            if (response.success && Array.isArray(response.result)) {
                setData(response.result);
            } else {
                setData([]);
                setMessage(response.message || "Не удалось загрузить заявки");
            }
            setLoadingTickets(false);
        };

        const GetUserInf = async () => {
            setLoadingUser(true);
            const response = await GetUserProfInf(cookies.auth_token);
            if (response.success && response.result) {
                setUserdata(response.result);
            } else {
                setUserdata(null);
                setUMessage(response.message || "Не удалось загрузить профиль");
            }
            setLoadingUser(false);
        };

        GetUserInf();
        GetUserTickets();
    }, [cookies.auth_token]);

    const handleDelete = async (uuid: string) => {
        const { success, message } = await DeleteTicket(uuid);
        if (success) {
            window.location.reload();
        } else {
            setMessage(message || "Не удалось удалить заявку");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold text-black mb-6 text-center">Мой профиль и заявки</h1>
                {umessage && <p className="text-red-500 text-center">{umessage}</p>}
                {message && <p className="text-red-500 text-center">{message}</p>}

                {loadingUser ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : userdata ? (
                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-6 border border-gray-300">
                        <h2 className="text-xl font-semibold text-black">Информация о пользователе</h2>
                        <div className="mt-3 text-sm text-gray-600">
                            <p><strong>Никнейм:</strong> {userdata.username}</p>
                            <p><strong>Почта:</strong> {userdata.email}</p>
                            <p><strong>Роль:</strong> {userdata.role}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center text-lg">Не удалось загрузить информацию о пользователе.</p>
                )}
                <h2 className="text-2xl font-bold text-black mb-6 text-center">Заявки:</h2>
                {loadingTickets ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-gray-700 text-center text-lg">У вас пока нет заявок.</p>
                ) : (
                    <div className="space-y-4">
                        {data.slice().reverse().map((ticket) => (
                            <div key={ticket.uuid} className="border border-gray-300 rounded-lg p-5 shadow-md bg-gray-50 hover:shadow-lg transition-all mb-3 relative">
                                <Link href={`/ticket_page/${ticket.uuid}`}>
                                    <h2 className="text-xl font-bold text-black">{ticket.title}</h2>
                                    <div className="mt-3 text-sm text-gray-600">
                                        <p><strong>Тема:</strong> {ticket.topic_id}</p>
                                        <p>
                                            <strong>Дата: </strong>
                                            {ticket.create_at ? new Date(ticket.create_at).toLocaleString("ru-RU", {
                                                dateStyle: 'long',
                                                timeStyle: 'short'
                                            }) : "Неизвестно"}
                                        </p>
                                    </div>
                                    <div className="mt-3">
                                        <span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: ticket.status_color }}>
                                            Статус: {ticket.status_id}
                                        </span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => handleDelete(ticket.uuid)}
                                    className="absolute top-2 right-2 text-white px-2 py-1 rounded-lg text-sm hover:bg-gray-200 transition"
                                >
                                    <Image className="w-[20px]" src={dleteimg} alt={"delete"}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
