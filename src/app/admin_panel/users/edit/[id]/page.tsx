"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { useUserStore } from "@/store/user_store";
import { GetAllTopics, GetUserById, UpdateUser } from "@/app/Api/Api";
import { UserFormData, TopicInterface } from "@/app/models/models";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "@/app/components/header";
import * as yup from "yup";

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Имя обязательно"),
    email: Yup.string().email("Неверный email").required("Email обязателен"),
    role: yup
        .string()
        .required("Выберите роль пользователя"),
    responsibility: yup
        .number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : Number(originalValue)
        )
});

export default function EditUserPage() {
    const params = useParams();
    const id = String(params?.id);
    const [cookies] = useCookies(["auth_token"]);
    const [message, setMessage] = useState<string | null>(null);
    const [topicData, setTopicData] = useState<TopicInterface[]>([]);
    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
        resolver: yupResolver(validationSchema),
    });

    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    useEffect(() => {
        if (!hydrated) return;

        if (!cookies.auth_token || userData === null) {
            router.push("/sign_in/");
        } else if (userData.role !== "admin") {
            router.push("/");
        } else {
            const fetchData = async () => {
                console.log(id)
                const [userResponse, topicsResponse] = await Promise.all([
                    GetUserById(id),
                    GetAllTopics(),
                ]);
                console.log(userResponse)
                if (userResponse.success && topicsResponse.success) {
                    const user = userResponse.result;
                    reset({
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        responsibility: user.responsibility ?? "",
                    });
                    setTopicData(topicsResponse.result);
                } else {
                    setMessage("Ошибка при загрузке данных");
                }
            };
            fetchData();
        }
    }, [cookies.auth_token, userData, hydrated, id, reset]);

    const onSubmit = async (data: UserFormData) => {
        try {
            const response = await UpdateUser(id, data.username, data.email, data.role, cookies.auth_token, data.responsibility);

            if (response.success) {
                router.push("/admin_panel/users/");
            } else {
                setMessage(response.message || "Ошибка при обновлении пользователя");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };

    if (!hydrated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold text-center mb-4">Редактирование пользователя</h1>

                    {message && <p className="text-red-600 text-center">{message}</p>}

                    {/* Имя */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Имя</label>
                        <input
                            type="text"
                            {...register("username")}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                            placeholder="Имя пользователя"
                        />
                        {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                            placeholder="example@mail.com"
                        />
                        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                    </div>

                    {/* Роль */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Роль</label>
                        <select
                            {...register("role")}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                        >
                            <option value="">Выберите роль</option>
                            <option value="admin">Администратор</option>
                            <option value="worker">Работник</option>
                            <option value="user">Пользователь</option>
                        </select>
                        {errors.role && <p className="text-red-600">{errors.role.message}</p>}
                    </div>

                    {/* Ответственность */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Ответственность</label>
                        <select
                            {...register("responsibility")}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                        >
                            <option value="">Null</option>
                            {topicData.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                        {errors.responsibility && <p className="text-red-600">{errors.responsibility.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                    >
                        Сохранить изменения
                    </button>
                </form>
            </div>
        </div>
    );
}
