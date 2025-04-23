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

        const result = await pool.query("SELECT * FROM status WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Заявка не найдена" });
        }

        return res.status(200).json({ success: true, result: result.rows });
    } catch (error) {
        console.error("Ошибка при получении заявок:", error);
        return res.status(500).json({ success: false, message: "Не удалось получить данные" });
    }
}
