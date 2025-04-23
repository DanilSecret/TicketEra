"use server";

import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/app/models/models";

const JWT_SECRET = process.env.JWT_SECRET || "ошибка";

export default async function updateTopicByAdmin(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
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

        if (!userUuid || userRole !== "admin") {
            return res.status(401).json({ message: "Недостаточно прав" });
        }

        const userResult = await pool.query("SELECT * FROM users WHERE uuid = $1", [userUuid]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        const { id, name } = req.body as {
            id: number;
            name: string;

        };

        if (!id || !name) {
            return res.status(400).json({ message: "Поля заполнены некорректно" });
        }

        const result = await pool.query(
            "UPDATE topic SET name = $1 WHERE id = $2 RETURNING *",
            [name, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Статус не найден" });
        }

        return res.status(200).json({ message: "Статус обновлён", status: result.rows[0] });

    } catch (error) {
        console.error("Ошибка обновления статуса:", error);
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
