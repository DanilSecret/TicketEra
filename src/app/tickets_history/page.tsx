"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TicketInterface } from "@/app/models/models";
import { GetHiddenTickets } from "@/app/Api/Api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { useUserStore } from "@/store/user_store";

export default function HistoryPage() {
    const [cookies] = useCookies(["auth_token"]);
    const [tickets, setTickets] = useState<TicketInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const router = useRouter();

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    useEffect(() => {
        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push('/sign_in/');
        } else if (userData.role !== "admin" && userData.role !== "worker") {
            router.push('/');
        } else {
            const fetchTickets = async () => {
                setLoading(true);
                const response = await GetHiddenTickets(cookies.auth_token);
                if (response.success && Array.isArray(response.result)) {
                    setTickets(response.result);
                } else {
                    setMessage(response.message || "Ошибка при загрузке заявок");
                }
                setLoading(false);
            };

            fetchTickets();
        }
    }, [cookies.auth_token, userData, hydrated]);

    const filteredTickets = tickets.filter(ticket => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
            ticket.title.toLowerCase().includes(lowerQuery) ||
            ticket.topic_id.toLowerCase().includes(lowerQuery) ||
            ticket.status_id.toLowerCase().includes(lowerQuery) ||
            new Date(ticket.create_at).toLocaleDateString("ru-RU").includes(lowerQuery)
        );
    });

    if (!hydrated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }
    if (!cookies.auth_token || userData === null || (userData.role !== "admin" && userData.role !== "worker")) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <Header/>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-black mb-6 text-center">История выполненных заявок</h1>

                    {message && <p className="text-red-500 text-center">{message}</p>}

                    <div className="mb-6 text-center text-black">
                        <input
                            type="text"
                            placeholder="Поиск по названию, теме или дате..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <p className="text-gray-700 text-center text-lg">Заявок не найдено</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredTickets.slice().reverse().map((ticket) => (
                                <Link
                                    href={`/ticket_page/${ticket.uuid}`}
                                    key={ticket.uuid}
                                    className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <h2 className="text-lg font-bold text-black mb-2">{ticket.title}</h2>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Тема:</strong> {ticket.topic_id}</p>
                                        <p className="text-sm text-gray-600 mb-3">
                                            <strong>Дата:</strong>{" "}
                                            {ticket.create_at ? new Date(ticket.create_at).toLocaleString("ru-RU", {
                                                dateStyle: "long",
                                                timeStyle: "short",
                                            }) : "Неизвестно"}
                                        </p>
                                    </div>
                                    <span
                                        className="px-3 py-1 rounded-full text-white text-sm font-medium self-start"
                                        style={{ backgroundColor: ticket.status_color }}
                                    >
                                        Статус: {ticket.status_id}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
