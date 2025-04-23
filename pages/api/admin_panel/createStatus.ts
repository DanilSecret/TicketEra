"use server";

import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/app/models/models";

const JWT_SECRET = process.env.JWT_SECRET || "ошибка";

export default async function createStatus(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
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

        const { name, color, visible } = req.body as {
            name: string;
            color: string;
            visible: boolean;
        };

        if (!name || !color || typeof visible !== "boolean") {
            return res.status(400).json({ message: "Все поля должны быть заполнены" });
        }


        const result = await pool.query(
            "INSERT INTO status (name, color, visible) VALUES ($1, $2, $3) RETURNING *",
            [name, color, visible]
        );

        return res.status(201).json({
            message: "Статус успешно создан",
            status: result.rows[0],
        });

    } catch (error) {
        console.error("Ошибка при создании статуса:", error);
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
