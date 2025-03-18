"use client"

import Link from "next/link";

export default function Home() {
    return (
        <div>
            <Link href="/sign_up/">Регистрация</Link>
            <p></p>
            <Link href="/sign_in/">Авторизация</Link>
            <p></p>
            <Link href="/create_ticket/">Создать заявку</Link>
        </div>
    )
}
