"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TicketInterface } from "@/app/models/models";
import { GetTicketsByUser } from "@/app/Api/Api";
import Link from "next/link";

export default function UserProfile() {
    const [cookies] = useCookies(["auth_token"]);
    const [message, setMessage] = useState<string | null>(null);
    const [data, setData] = useState<TicketInterface[]>([]);


    useEffect(() => {
        const GetUserTickets = async () => {
            const response = await GetTicketsByUser(cookies.auth_token);

            if (response.success && Array.isArray(response.result)) {
                setData(response.result);
            } else {
                setData([]);
                setMessage(response.message || "Не удалось загрузить заявки");
            }
        };
        GetUserTickets();
    }, [cookies.auth_token]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold text-black mb-6 text-center">Мои заявки</h1>

                {message && <p className="text-red-500 text-center">{message}</p>}

                {data.length === 0 ? (
                    <p className="text-gray-700 text-center text-lg">У вас пока нет заявок.</p>
                ) : (
                    <div className="space-y-4">
                        {data.map((ticket) => (
                            <Link key={ticket.uuid} href={ticket.uuid}>
                                <div
                                    key={ticket.uuid}
                                    className="border border-gray-300 rounded-lg p-5 shadow-md bg-gray-50 hover:shadow-lg transition-all mb-3"
                                >
                                    <h2 className="text-xl font-bold text-black">{ticket.title}</h2>

                                    <div className="mt-3 text-sm text-gray-600">
                                        <p><strong>Тема:</strong> {ticket.topic_id}</p>
                                        <p>
                                            <strong>Дата: </strong>
                                            {ticket.create_at ? new Date(ticket.create_at).toLocaleString("ru-RU", { dateStyle: 'long', timeStyle: 'short' }) : "Неизвестно"}
                                        </p>
                                    </div>

                                    <div className="mt-3">
                                        <span className="px-3 py-1 rounded-full text-white bg-blue-600 text-sm font-medium">
                                            Статус: {ticket.status_id}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
