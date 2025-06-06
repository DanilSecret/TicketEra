"use server"

import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function GetTopics(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM topic');
            return res.status(200).json({ result: result.rows });
        } catch (error) {
            console.error('Error fetching user data:', error);
            return res.status(500).json({ error: 'Failed to fetch user data' });
        }
    } else {
        console.error('Method is not allowed');
        return res.status(405).end();
    }
}
