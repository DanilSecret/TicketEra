"use server";

import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/app/models/models";

const JWT_SECRET = process.env.JWT_SECRET || "ошибка";

export default async function UpdateTicketStatus(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ message: "Метод не поддерживается" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Токен не предоставлен" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userUuid = decoded.userUuid;
        const userRole = decoded.userRole;

        if (!userUuid) {
            return res.status(401).json({ message: "Недействительный токен" });
        }

        if (userRole !== "worker" && userRole !== "admin") {
            return res.status(403).json({ message: "Недостаточно прав для изменения статуса заявки" });
        }

        const { ticket_uuid, status_id } = req.body as {
            ticket_uuid: string;
            status_id: number;
        };

        if (!ticket_uuid || status_id === undefined) {
            return res.status(400).json({ message: "Ошибка получения данных с клиента" });
        }

        const existingTicket = await pool.query("SELECT * FROM tickets WHERE uuid = $1", [ticket_uuid]);
        if (existingTicket.rows.length === 0) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }

        // Обновляем статус тикета
        const result = await pool.query(
            "UPDATE tickets SET status_id = $1 WHERE uuid = $2 RETURNING *",
            [status_id, ticket_uuid]
        );

        res.status(200).json({
            message: "Статус заявки успешно обновлён",
            ticket: result.rows[0],
        });
    } catch (error) {
        console.error("Ошибка при обновлении статуса заявки:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
