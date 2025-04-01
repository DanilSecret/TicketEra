"use client";

import { useEffect, useState } from "react";
import { GetTicketById } from "@/app/Api/Api";
import { TicketInterface } from "@/app/models/models";
import { useParams } from "next/navigation";

export default function TicketPage() {
    const params = useParams();
    const [ticket, setTicket] = useState<TicketInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

        fetchTicket();
    }, [params]);

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
                        <h2 className="text-xl font-semibold text-black mb-3">{ticket.title}</h2>
                        <p className="text-gray-600 text-sm mb-4">{ticket.description}</p>

                        <div className="mt-3 text-sm text-gray-600">
                            <p><strong>Автор:</strong> {ticket.author} <strong>Почта:</strong> {ticket.author_email}</p>
                            <p><strong>Тема:</strong> {ticket.topic_id}</p>
                            <p>
                                <strong>Дата: </strong>
                                {ticket.create_at ? new Date(ticket.create_at).toLocaleString("ru-RU", {
                                    dateStyle: 'long',
                                    timeStyle: 'short'
                                }) : "Неизвестно"}
                            </p>
                            <p>
                                <strong>Статус:</strong>
                                <span className="px-3 py-1 ml-2 rounded-full text-white bg-blue-600 text-sm font-medium">
                                    {ticket.status_id}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700 text-center text-lg">Заявка не найдена.</p>
                )}
            </div>
        </div>
    );
}
