"use server"

import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function DeleteTopic(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { topic_id } = req.body;

        if (!topic_id) {
            return res.status(400).json({ success: false, message: 'status_id не предоставлен' });
        }

        try {
            const result = await pool.query('DELETE FROM topic WHERE id = $1 RETURNING *', [topic_id]);

            if (result.rows.length !== 0) {
                return res.status(200).json({ success: true, message: 'Статус успешно удален' });
            }else{
                return res.status(404).json({ error: 'Статус не найден' });
            }
        } catch (error) {
            console.error('Ошибка при удалении статуса:', error);
            return res.status(500).json({ success: false, message: 'Ошибка при удалении статуса' });
        }
    } else {
        console.error('Метод не поддерживается');
        return res.status(405).end();
    }
}
