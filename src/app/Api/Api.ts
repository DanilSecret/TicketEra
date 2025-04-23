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



export async function GetAdminTickets(auth_token: string) {
    try {
        const res = await fetch("/api/admin_panel/getAllTickets", {
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

export async function CreateAdminTicket(title: string, description: string, topic_id: number, auth_token: string) {
    try {
        const response = await fetch("/api/admin_panel/createTicketByAdmin", {
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

export async function GetAdminStatuses(auth_token: string) {
    try {
        const res = await fetch("/api/admin_panel/getAllStatuses", {
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

export async function DeleteStatus(status_id:number){
    try {
        const response = await fetch(`/api/admin_panel/deleteStatus`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status_id }),
        });
        const result = await response.json();
        return {success: response.ok, result: result.result};
    } catch (error){
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function CreateStatus(name: string, color: string, visible: boolean, auth_token: string) {
    try {
        const response = await fetch("/api/admin_panel/createStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({ name, color, visible }),
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function GetStatusById(id: number) {
    try {
        const response = await fetch(`/api/admin_panel/getStatusById?id=${id}`, {
            method: "GET",
        });

        const result = await response.json();
        return {success: response.ok, result: result.result};
    } catch (error) {
        console.error("Ошибка при получении статуса по ID:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}


export async function UpdateStatus(id: number, name: string, color: string, visible: boolean, auth_token: string) {
    try {
        const response = await fetch(`/api/admin_panel/updateStatus/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({id, name, color, visible }),
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function GetAdminTopics(auth_token:string){
    try {
        const response = await fetch(`/api/admin_panel/getAllTopics`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        });
        const result = await response.json();
        return {success: response.ok, result: result.result};
    }catch (error) {
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function DeleteTopic(topic_id:number){
    try {
        const response = await fetch(`/api/admin_panel/deleteTopic`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic_id }),

        });
        const result = await response.json();
        return {success: response.ok, result: result.result};
    } catch (error){
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function CreateTopic(name:string, auth_token:string){
    try {
        const response = await fetch("/api/admin_panel/createTopic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({ name }),
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}

export async function GetTopicById(id:number){
    try {
        const response = await fetch(`/api/admin_panel/getTopicById?id=${id}`, {
            method: "GET",
        });

        const result = await response.json();
        return {success: response.ok, result: result.result};
    } catch (error) {
        console.error("Ошибка при получении статуса по ID:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}
export async function UpdateTopic(id: number, name: string, auth_token: string) {
    try {
        const response = await fetch(`/api/admin_panel/updateTopic/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({id, name }),
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
        return { success: false, message: "Ошибка соединения с сервером" };
    }
}