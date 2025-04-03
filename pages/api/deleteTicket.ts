"use server"

import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function DeleteTicket(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { ticket_uuid } = req.body;

        if (!ticket_uuid) {
            return res.status(400).json({ success: false, message: 'ticket_uuid не предоставлен' });
        }

        try {
            const result = await pool.query('DELETE FROM tickets WHERE uuid = $1 RETURNING *', [ticket_uuid]);

            if (result.rows.length !== 0) {
                return res.status(200).json({ success: true, message: 'Тикет успешно удален' });
            }else{
                return res.status(404).json({ error: 'Заявка не найдена' });
            }
        } catch (error) {
            console.error('Ошибка при удалении тикета:', error);
            return res.status(500).json({ success: false, message: 'Ошибка при удалении тикета' });
        }
    } else {
        console.error('Метод не поддерживается');
        return res.status(405).end();
    }
}
