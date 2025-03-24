"use server";

import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
import {JwtPayload} from "@/app/models/models";

const JWT_SECRET = process.env.JWT_SECRET || "ошибка";



export default async function CreateTicket(req: NextApiRequest, res: NextApiResponse) {
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
        const username = decoded.username;
        const userEmail = decoded.userEmail;

        if (!userUuid) {
            return res.status(401).json({ message: "Недействительный токен" });
        }

        const { title, description, topic_id } = req.body as {
            title: string;
            description: string;
            topic_id: number;
        };

        if (!title || !description || !topic_id) {
            return res.status(400).json({ message: "Все обязательные поля должны быть заполнены" });
        }

        // Проверяем, существует ли пользователь
        const existingUser = await pool.query("SELECT * FROM users WHERE uuid = $1", [userUuid]);
        if (existingUser.rows.length === 0) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        const uuid = uuidv4();

        const result = await pool.query(
            "INSERT INTO tickets (uuid, title, description, topic_id, author_uuid, create_at, author, author_email) VALUES ($1, $2, $3, $4, $5, NOW(),$6, $7) RETURNING *",
            [uuid, title, description, topic_id, userUuid, username, userEmail]
        );

        res.status(201).json({
            message: "Тикет успешно создан",
            ticket: result.rows[0],
        });
    } catch (error) {
        console.error("Ошибка при создании тикета:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
