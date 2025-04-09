"use client";

import { useState } from 'react';
import Image from "next/image";
import logo from "@/app/assets/logo.svg"
import user from "@/app/assets/user.svg"
import Cookies from "js-cookie";
import {useUserStore} from "@/store/user_store";
import Link from "next/link";
import {useRouter} from "next/navigation";

export function Header() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const router = useRouter()

    const isAuth = useUserStore((state) => state.isAuth);
    const {setUserData, setIsAuth} = useUserStore();
    const userData = useUserStore((state) => state.userData);

    const destroyCookie = () => {
        Cookies.remove("auth_token");
        setUserData(null);
        setIsAuth(false);
        setUserMenuOpen(!isUserMenuOpen)
        router.push('/')
    };

    return (
        <header className="bg-[#03062c] text-white w-full px-4 py-3 shadow-md">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={"/"} className="cursor-pointer flex items-center gap-2">
                        <Image src={logo} alt="logo" width={50} height={50} />
                    </Link>
                    <nav className="hidden md:flex items-center gap-4 text-sm">
                        <Link href="/" className="hover:underline">Главная</Link>

                        { userData?.role === "admin" ? (
                            <div className="hidden md:flex items-center gap-4 text-sm">
                                <Link href="/create_ticket/" className="hover:underline">Создать заявку</Link>
                                <Link href="/tickets_list/" className="hover:underline">Лист заявок</Link>
                                <Link href="/tickets_history/" className="hover:underline">История заявок</Link>
                            </div>
                        ): userData?.role === "worker" ? (
                            <div className="hidden md:flex items-center gap-4 text-sm">
                                <Link href="/tickets_list/" className="hover:underline">Лист заявок</Link>
                                <Link href="/tickets_history/" className="hover:underline">История заявок</Link>
                            </div>
                        ) : (
                            <Link href="/create_ticket/" className="hover:underline">Создать заявку</Link>
                        )}

                    </nav>
                </div>
                <div className="flex items-center gap-4 relative">
                    {isAuth ? (
                        <div className="flex items-center gap-4 relative">

                            <button
                                onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                                className="focus:outline-none hidden md:flex items-center gap-4"
                            >
                                <span className="hidden md:block text-sm">{userData?.username}</span>
                                <Image src={user} alt="user" width={50} height={50}/>
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-6 text-sm">
                            <Link href="/sign_up/">Регистрация</Link>
                            <Link href="/sign_in/">Авторизация</Link>
                        </div>
                    )}

                    {isUserMenuOpen && (
                        <div
                            className="absolute right-0 top-12 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
                            <Link href="/user_profile/" className="text-center block px-4 py-2 hover:bg-gray-200">Профиль</Link>
                            <button className="w-full block px-4 py-2 hover:bg-gray-200" onClick={destroyCookie}>Выйти</button>
                        </div>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden focus:outline-none"
                    >
                        <div className="space-y-1">
                            <span className="block w-6 h-0.5 bg-white"></span>
                            <span className="block w-6 h-0.5 bg-white"></span>
                            <span className="block w-6 h-0.5 bg-white"></span>
                        </div>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <nav className="md:hidden mt-2 space-y-2">
                    <Link href="/" className="block px-4 py-2 hover:bg-[#1a1f4d]">Главная</Link>

                    { userData?.role === "admin" ? (
                        <div className="space-y-2">
                            <Link href="/create_ticket/" className="block px-4 py-2 hover:bg-[#1a1f4d]">Создать заявку</Link>
                            <Link href="/tickets_list/" className="block px-4 py-2 hover:bg-[#1a1f4d]">Лист заявок</Link>
                            <Link href="/tickets_history/" className="block px-4 py-2 hover:bg-[#1a1f4d]">История заявок</Link>
                        </div>
                    ): userData?.role === "worker" ? (
                        <div className="space-y-2">
                            <Link href="/tickets_list/" className="block px-4 py-2 hover:bg-[#1a1f4d]">Лист заявок</Link>
                            <Link href="/tickets_history/" className="block px-4 py-2 hover:bg-[#1a1f4d]">История заявок</Link>
                        </div>
                    ):(
                        <Link href="/create_ticket/" className="block px-4 py-2 hover:bg-[#1a1f4d]">Создать заявку</Link>
                    )}
                    {isAuth ? (
                        <div className="space-y-2">
                            <Link href="/user_profile/" className="block px-4 py-2 hover:bg-[#1a1f4d]">Профиль</Link>
                            <div className="block px-4 py-2 w-full hover:bg-[#1a1f4d]">
                                <button className="w-full text-left" onClick={destroyCookie}>Выйти</button>
                            </div>

                        </div>

                    ) : (
                        <div className="space-y-2">
                            <Link className="block px-4 py-2 hover:bg-[#1a1f4d]" href="/sign_up/">Регистрация</Link>
                            <Link className="block px-4 py-2 hover:bg-[#1a1f4d]" href="/sign_in/">Авторизация</Link>
                        </div>
                    )}
                </nav>
            )}
        </header>
    );
}

export default Header;
