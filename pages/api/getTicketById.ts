"use server";

import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";


export default async function GetTicketById(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Метод не разрешен" });
    }

    try {
        const { id } = req.query;
        if (!id) {
            return res.status(401).json({ message: "Ошибка получения id" });
        }

        const result = await pool.query("SELECT * FROM tickets WHERE uuid = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Заявка не найдена" });
        }

        const ticketsWithNames = await Promise.all(result.rows.map(async (ticket) => {
            const topicResult = await pool.query("SELECT name FROM topic WHERE id = $1", [ticket.topic_id]);
            const topicName = topicResult.rows.length > 0 ? topicResult.rows[0].name : "Неизвестно";

            const statusResult = await pool.query("SELECT name FROM status WHERE id = $1", [ticket.status_id]);
            const statusName = statusResult.rows.length > 0 ? statusResult.rows[0].name : "Неизвестно";

            return {
                ...ticket,
                topic_id: topicName,
                status_id: statusName,
            };
        }));
        return res.status(200).json({ success: true, result: ticketsWithNames });
    } catch (error) {
        console.error("Ошибка при получении заявок:", error);
        return res.status(500).json({ success: false, message: "Не удалось получить данные" });
    }
}
