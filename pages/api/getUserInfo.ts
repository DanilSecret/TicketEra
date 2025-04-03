"use server";

import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/app/models/models";

const JWT_SECRET = process.env.JWT_SECRET || "ошибка";

export default async function GetUserInfo(req: NextApiRequest, res: NextApiResponse) {
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

        if (!userUuid) {
            return res.status(401).json({ message: "Недействительный токен" });
        }

        const result = await pool.query("SELECT * FROM users WHERE uuid = $1", [userUuid]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }


        return res.status(200).json({ success: true, result: result.rows[0]});
    } catch (error) {
        console.error("Ошибка при получении заявок:", error);
        return res.status(500).json({ success: false, message: "Не удалось получить данные" });
    }
}
