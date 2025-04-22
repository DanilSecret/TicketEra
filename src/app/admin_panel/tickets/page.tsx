"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TicketInterface } from "@/app/models/models";
import {DeleteTicket, GetAdminTickets} from "@/app/Api/Api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { useUserStore } from "@/store/user_store";

export default function AdminTicketsPage() {
    const [cookies] = useCookies(["auth_token"]);
    const [tickets, setTickets] = useState<TicketInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);
    const router = useRouter();

    useEffect(() => {
        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push('/sign_in/');
        } else if (userData.role !== "admin") {
            router.push('/');
        } else {
            const fetchTickets = async () => {
                setLoading(true);
                const response = await GetAdminTickets(cookies.auth_token);
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

    const filteredTickets = tickets.filter((ticket) => {
        const q = searchQuery.toLowerCase();
        return (
            ticket.title.toLowerCase().includes(q) ||
            ticket.topic_id.toLowerCase().includes(q) ||
            ticket.status_id.toLowerCase().includes(q) ||
            new Date(ticket.create_at).toLocaleDateString("ru-RU").includes(q)
        );
    });

    if (!hydrated) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Загрузка данных...</div>;
    }

    async function handleDelete(uuid: string) {
        const confirmed = window.confirm("Вы уверены, что хотите удалить заявку?");
        if (!confirmed) return;

        const { success, message } = await DeleteTicket(uuid);
        if (success) {
            setTickets((prev) => prev.filter((t) => t.uuid !== uuid));
        } else {
            setMessage(message || "Не удалось удалить заявку");
        }

    }

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-black">Управление заявками</h1>

                    </div>

                    {message && <p className="text-red-500 text-center">{message}</p>}

                    <div className="flex items-center gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Поиск по названию, теме, статусу или дате..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                        />
                        <Link
                            href="/admin_panel/tickets/add"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition whitespace-nowrap"
                        >
                            + Добавить заявку
                        </Link>
                    </div>


                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div
                                className="border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded shadow">
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-200 text-xs uppercase text-gray-600">
                                <tr>
                                    <th className="px-4 py-3">Название</th>
                                    <th className="px-4 py-3">Тема</th>
                                    <th className="px-4 py-3">Дата</th>
                                    <th className="px-4 py-3">Статус</th>
                                    <th className="px-4 py-3 text-center">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTickets.slice().reverse().map((ticket) => (
                                    <tr key={ticket.uuid} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <Link href={`/admin_panel/tickets/${ticket.uuid}`} className="text-blue-600 hover:underline">{ticket.title}</Link>
                                        </td>
                                        <td className="px-4 py-3">{ticket.topic_id}</td>
                                        <td className="px-4 py-3">
                                            {ticket.create_at ? new Date(ticket.create_at).toLocaleString("ru-RU", {dateStyle: "medium", timeStyle: "short"}) : "Неизвестно"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-3 py-1 rounded-full text-white text-xs font-semibold" style={{backgroundColor: ticket.status_color}}>{ticket.status_id}</span>
                                        </td>
                                        <td className="px-4 py-3 flex justify-center gap-4">
                                            {/*<Link href={`/admin_panel/tickets/edit/${ticket.uuid}`} className="text-blue-600 hover:underline">Изменить</Link>*/}
                                            <button onClick={() => handleDelete(ticket.uuid)} className="text-red-600 hover:underline">Удалить</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );


}
