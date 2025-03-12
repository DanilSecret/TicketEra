"use client"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div>
            <Link href="/sign_up/">Регистрация</Link>
            <p></p>
            <Link href="/sign_in/">Авторизация</Link>
        </div>
    )
}
