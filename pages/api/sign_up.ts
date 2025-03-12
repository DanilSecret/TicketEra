"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не поддерживается' });
    }

    const { username, password, email } = req.body;

    // Проверка, что данные пришли
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

    try {
        // Проверяем, существует ли пользователь
        const existingUser = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Генерируем UUID
        const uuid = uuidv4();

        // Сохраняем пользователя в базу данных
        const result = await pool.query(
            'INSERT INTO "users" (username, password, uuid, email) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, hashedPassword, uuid, email]
        );

        const newUser = result.rows[0];
        console.log('Пользователь успешно зарегистрирован')
        // Возвращаем ответ
        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
        });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
}
