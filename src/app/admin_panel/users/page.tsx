"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { useUserStore } from "@/store/user_store";
import Link from "next/link";
import { GetAdminUsers, DeleteUser } from "@/app/Api/Api";
import { UserInterface } from "@/app/models/models";

export default function AdminUsersPage() {
    const [cookies] = useCookies(["auth_token"]);
    const [users, setUsers] = useState<UserInterface[]>([]);
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
            const fetchUsers = async () => {
                setLoading(true);
                const response = await GetAdminUsers(cookies.auth_token);
                if (response.success && Array.isArray(response.result.rows)) {
                    setUsers(response.result.rows);
                } else {
                    setMessage(response.message || "Ошибка при загрузке пользователей");
                }
                setLoading(false);
            };
            fetchUsers();
        }
    }, [cookies.auth_token, userData, hydrated]);

    async function handleDelete(uuid: string) {
        const confirmed = window.confirm("Удалить пользователя?");
        if (!confirmed) return;

        const { success, message } = await DeleteUser(uuid);
        if (success) {
            setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
        } else {
            setMessage(message || "Не удалось удалить пользователя");
        }
    }

    const filteredUsers = users.filter((user) => {
        const q = searchQuery.toLowerCase();
        return user.username.toLowerCase().includes(q)
            || user.email.toLowerCase().includes(q)
            || user.role.toLowerCase().includes(q)
            || user.responsibility?.toString().includes(q);
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
                        <h1 className="text-3xl font-bold text-black">Управление пользователями</h1>
                    </div>

                    {message && <p className="text-red-500 text-center">{message}</p>}

                    <div className="flex items-center gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Поиск по имени, почте, роли или ID темы..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                        />
                        <Link
                            href="/admin_panel/users/add"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition whitespace-nowrap"
                        >
                            + Добавить пользователя
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
                                    <th className="px-4 py-3">Имя</th>
                                    <th className="px-4 py-3">Почта</th>
                                    <th className="px-4 py-3">Роль</th>
                                    <th className="px-4 py-3">ID темы</th>
                                    <th className="px-4 py-3 text-center">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.uuid} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{user.username}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">{user.role}</td>
                                        <td className="px-4 py-3">{user.responsibility ?? "–"}</td>
                                        <td className="px-4 py-3 flex justify-center gap-4">
                                            <Link href={`/admin_panel/users/edit/${user.uuid}`} className="text-blue-600 hover:underline">Изменить</Link>
                                            <button onClick={() => handleDelete(user.uuid)} className="text-red-600 hover:underline">Удалить</button>
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
