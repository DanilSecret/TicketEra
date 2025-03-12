"use client"

export default async function registerUser(username: string, password: string, email: string) {
    try {
        const response = await fetch("/api/sign_up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email}),
        });

        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function authUser(username: string, password: string) {
    try {
        const response = await fetch(`/api/sign_in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        return { success: response.ok, message: result.message };
    }catch (error) {
        console.error("Ошибка при авторизации:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}