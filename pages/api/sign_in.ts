"use server";

import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Метод не поддерживается" });
    }

    const { username, password } = await req.body;

    // Проверка входных данных
    if (!username || !password) {
        return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
    }

    try {
        // Проверяем наличие пользователя
        const result = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);
        const userData = result.rows[0];

        if (!userData) {
            return res.status(401).json({ message: "Неверное имя пользователя" });
        }

        // Проверяем пароль
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Неверный пароль" });
        }

        // Генерация токена
        const tokenPayload = {
            userUuid: userData.uuid,
            username: userData.username,
            userEmail: userData.email,
            userRole: userData.role,
            userResp: userData.responsibility || null,
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
            expiresIn: "1d",
        });

        // Создаем cookie
        const serializedCookie = serialize("auth_token", token, {
            httpOnly: false,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400,
            path: "/",
        });

        // Устанавливаем cookie и возвращаем успешный ответ
        res.setHeader("Set-Cookie", serializedCookie);
        res.status(200).json({ message: "Вход выполнен успешно", result: result });
    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
