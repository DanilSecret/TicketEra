"use client";

import Header from "@/app/components/header";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/user_store";

import UserIcon from "@/app/assets/user-svgrepo-com.svg";
import TicketIcon from "@/app/assets/tickets-svgrepo-com.svg";
import StatusIcon from "@/app/assets/bullet-list-svgrepo-com.svg";
import TopicIcon from "@/app/assets/status-unknown-svgrepo-com.svg";
import Image from "next/image";

export default function AdminPage() {
    const [cookies] = useCookies(["auth_token"]);
    const router = useRouter();

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    const tables = [
        {
            name: "Пользователи",
            path: "/admin_panel/users",
            color: "bg-blue-500",
            icon: UserIcon,
        },
        {
            name: "Заявки",
            path: "/admin_panel/tickets",
            color: "bg-green-500",
            icon: TicketIcon,
        },
        {
            name: "Статусы",
            path: "/admin_panel/status",
            color: "bg-rose-500",
            icon: StatusIcon,
        },
        {
            name: "Темы",
            path: "/admin_panel/topic",
            color: "bg-yellow-300",
            icon: TopicIcon,
        },
    ];

    useEffect(() => {
        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push("/sign_in/");
        } else if (userData.role !== "admin") {
            router.push("/");
        }
    }, [cookies.auth_token, userData, hydrated]);

    if (!hydrated || !cookies.auth_token || userData === null || userData.role !== "admin") {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-black mb-6 text-center">Админ панель</h1>

                    <div className="flex flex-col gap-y-4">
                        {tables.map((table) => (
                            <Link
                                key={table.path}
                                href={table.path}
                                className={`rounded-lg shadow-md p-4 flex items-center text-white text-lg font-semibold hover:shadow-lg transition-all ${table.color}`}
                            >
                                <Image src={table.icon} alt={""} width={50} height={50} className={"mr-3"}></Image>
                                {table.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
