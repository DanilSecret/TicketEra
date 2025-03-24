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
        console.error("Ошибка при регистрации:", error);
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

export async function getAllTopics(){
    try {
        const response = await fetch(`/api/getTopics`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        return {success: response.ok, result: result.result};
    }catch (error) {
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function createTicket(title: string, description: string, topic_id: number, auth_token: string) {
    try {
        const response = await fetch("/api/createTicket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({ title, description, topic_id }),
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function GetTicketsByUser(auth_token: string){
    try {
        const response = await fetch("/api/getUserTickets", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            }

        });
        const result = await response.json();
        return {success: response.ok, result: result.result};
    } catch (error){
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}