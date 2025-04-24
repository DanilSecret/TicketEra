"use server";

import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JwtPayload } from "@/app/models/models";
import {v4 as uuidv4} from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "ошибка";

export default async function createUser(req: NextApiRequest, res: NextApiResponse) {
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
            return res.status(403).json({ message: "Недостаточно прав" });
        }

        const { username, email, role, responsibility, password } = req.body as {
            username: string;
            email: string;
            role: string;
            responsibility?: number | null;
            password: string;
        };

        if (!username || !email || !role || !password) {
            return res.status(400).json({ message: "Обязательные поля не заполнены" });
        }

        // Проверка, существует ли пользователь с таким email или username
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR username = $2",
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "Пользователь с таким email или username уже существует" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const uuid = uuidv4();

        const result = await pool.query(
            `INSERT INTO users (uuid, username, email, role, responsibility, password)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING uuid, username, email, role, responsibility`,
            [uuid, username, email, role, responsibility || null, hashedPassword]
        );

        return res.status(201).json({
            message: "Пользователь успешно создан",
            user: result.rows[0],
        });

    } catch (error) {
        console.error("Ошибка при создании пользователя:", error);
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
