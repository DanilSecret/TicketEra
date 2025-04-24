"use server";

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { JwtPayload } from "@/app/models/models";

const JWT_SECRET = process.env.JWT_SECRET || "ошибка";

export default async function updateUserByAdmin(req: NextApiRequest, res: NextApiResponse) {
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
            return res.status(403).json({ message: "Недостаточно прав" });
        }

        const { uuid, username, email, role, responsibility } = req.body as {
            uuid: string;
            username: string;
            email: string;
            role: string;
            responsibility: number | null;
        };

        if (!uuid || !username || !email || !role) {
            return res.status(400).json({ message: "Поля заполнены некорректно" });
        }

        // Получим текущие данные, чтобы сохранить старый пароль
        const existingUser = await pool.query("SELECT password FROM users WHERE uuid = $1", [uuid]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const existingPassword = existingUser.rows[0].password;

        // Обновление без изменения пароля
        const result = await pool.query(
            `UPDATE users SET 
                username = $1,
                email = $2,
                role = $3,
                responsibility = $4,
                password = $5
             WHERE uuid = $6 RETURNING *`,
            [username, email, role, responsibility, existingPassword, uuid]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        return res.status(200).json({ message: "Пользователь обновлён", user: result.rows[0] });

    } catch (error) {
        console.error("Ошибка обновления пользователя:", error);
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
