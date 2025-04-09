"use client"

export default async function RegisterUser(username: string, password: string, email: string) {
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

export async function AuthUser(username: string, password: string) {

    try {
        const response = await fetch(`/api/sign_in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        return { success: response.ok, message: result.message, result: result.result };
    }catch (error) {
        console.error("Ошибка при авторизации:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function GetAllTopics(){
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

export async function CreateTicket(title: string, description: string, topic_id: number, auth_token: string) {
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

export async function GetTicketById(id: string){
    try {
        const response = await fetch(`/api/getTicketById?id=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        return {success: response.ok, result: result.result};
    } catch (error){
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function GetAllStatus(){
    try {
        const response = await fetch(`/api/getAllStatus`,{
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

export async function ChangeTicketStatus(ticket_uuid:string, status_id: number, auth_token: string){
    try {
        const response = await fetch(`/api/changeTicketStatus`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({ ticket_uuid, status_id }),
        });
        const result = await response.json();
        return {success: response.ok, result: result.result};
    } catch (error){
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function DeleteTicket(ticket_uuid:string){
    try {
        const response = await fetch(`/api/deleteTicket`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ticket_uuid }),
        });
        const result = await response.json();
        return {success: response.ok, result: result.result};
    } catch (error){
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function GetTicketsForWorker(auth_token: string){
    try {
        const response = await fetch("/api/getTicketsForWorker", {
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

export async function GetHiddenTickets(auth_token: string) {
    try {
        const res = await fetch("/api/getTicketsHistory", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        });

        return await res.json();
    } catch (error) {
        console.error("Ошибка при получении скрытых заявок:", error);
        return { success: false, message: "Ошибка сети" };
    }
}
