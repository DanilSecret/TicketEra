"use client"

import Cookies from "js-cookie";
import Link from "next/link";
import {useUserStore} from "@/store/user_store";

export default function Home() {
    const isAuth = useUserStore((state) => state.isAuth);
    const {setUserData, setIsAuth} = useUserStore();

    const destroyCookie = () => {
        Cookies.remove("auth_token");
        window.location.reload();
        setUserData(null);
        setIsAuth(false);
    };

    return (
        <div>
            {isAuth ? (
                <div className="flex gap-5">
                    <button

                        onClick={destroyCookie}
                    >
                        Выйти
                    </button>
                </div>
            ) : (
                <div>
                    <Link href="/sign_up/">Регистрация</Link>
                    <p></p>
                    <Link href="/sign_in/">Авторизация</Link>
                    <p></p>
                </div>
            )}
            <Link href="/user_profile/">Профиль пользователя</Link>
            <p></p>
            <Link href="/create_ticket/">Создать заявку</Link>
            <p></p>
        </div>
    )
}
