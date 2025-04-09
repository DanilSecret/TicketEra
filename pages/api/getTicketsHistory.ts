"use server";

import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/app/models/models";

const JWT_SECRET = process.env.JWT_SECRET || "ошибка";

export default async function getTicketsHistory(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Метод не разрешен" });
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
        type UserRole = "admin" | "worker" | "user";

        const allowedRoles: UserRole[] = ["admin", "worker"];
        if (!allowedRoles.includes(userRole as UserRole)) {
            return res.status(401).json({ message: "Недостаточно прав" });
        }


        const userResult = await pool.query("SELECT * FROM users WHERE uuid = $1", [userUuid]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        const user = userResult.rows[0];
        const userResponsibility: number | null = user.responsibility;

        let ticketsQuery = `SELECT tickets.*, status.name AS status_name, status.color AS status_color FROM tickets JOIN status ON tickets.status_id = status.id WHERE status.visible = false`;
        const queryParams: (string | number)[] = [];

        if (userRole === "worker" && userResponsibility !== null) {
            ticketsQuery += ` AND tickets.topic_id = $1`;
            queryParams.push(userResponsibility);
        }

        const result = await pool.query(ticketsQuery, queryParams);

        if (result.rows.length === 0) {
            return res.status(200).json({ success: true, result: [] });
        }

        const ticketsWithNames = await Promise.all(result.rows.map(async (ticket) => {
            const topicResult = await pool.query("SELECT name FROM topic WHERE id = $1", [ticket.topic_id]);
            const topicName = topicResult.rows.length > 0 ? topicResult.rows[0].name : "Неизвестно";

            return {
                ...ticket,
                topic_id: topicName,
                status_id: ticket.status_name,
                status_color: ticket.status_color,
            };
        }));

        return res.status(200).json({ success: true, result: ticketsWithNames });

    } catch (error) {
        console.error("Ошибка при получении скрытых заявок:", error);
        return res.status(500).json({ success: false, message: "Не удалось получить данные" });
    }
}
