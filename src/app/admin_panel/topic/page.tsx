"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { useUserStore } from "@/store/user_store";
import { TopicInterface } from "@/app/models/models";
import Link from "next/link";
import { DeleteTopic, GetAdminTopics } from "@/app/Api/Api";

export default function AdminTopicsPage() {
    const [cookies] = useCookies(["auth_token"]);
    const [topics, setTopics] = useState<TopicInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);
    const router = useRouter();

    useEffect(() => {
        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push("/sign_in/");
        } else if (userData.role !== "admin") {
            router.push("/");
        } else {
            const fetchTopics = async () => {
                setLoading(true);
                const response = await GetAdminTopics(cookies.auth_token);
                if (response.success && Array.isArray(response.result.rows)) {
                    setTopics(response.result.rows);
                } else {
                    setMessage(response.message || "Ошибка при загрузке тем");
                }
                setLoading(false);
            };
            fetchTopics();
        }
    }, [cookies.auth_token, userData, hydrated]);

    async function handleDelete(id: number) {
        const confirmed = window.confirm("Удалить тему?");
        if (!confirmed) return;

        const { success, message } = await DeleteTopic(id);
        if (success) {
            setTopics((prev) => prev.filter((t) => t.id !== id));
        } else {
            setMessage(message || "Не удалось удалить тему");
        }
    }

    const filteredTopics = topics.filter((topic) => {
        const q = searchQuery.toLowerCase();
        return topic.name.toLowerCase().includes(q) || topic.id.toString().includes(q);
    });

    if (!hydrated) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Загрузка...</div>;
    }

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-black">Управление темами</h1>
                    </div>

                    {message && <p className="text-red-500 text-center">{message}</p>}

                    <div className="flex items-center gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Поиск по ID или названию темы..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                        />
                        <Link
                            href="/admin_panel/topic/add"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition whitespace-nowrap"
                        >
                            + Добавить тему
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded shadow">
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-200 text-xs uppercase text-gray-600">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Название</th>
                                    <th className="px-4 py-3 text-center">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTopics.sort((a, b) => a.id - b.id).map((topic) => (
                                    <tr key={topic.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{topic.id}</td>
                                        <td className="px-4 py-3">{topic.name}</td>
                                        <td className="px-4 py-3 flex justify-center gap-4">
                                            <Link href={`/admin_panel/topic/edit/${topic.id}`}
                                                  className="text-blue-600 hover:underline">Изменить</Link>
                                            <button onClick={() => handleDelete(topic.id)}
                                                    className="text-red-600 hover:underline">Удалить
                                            </button>
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
