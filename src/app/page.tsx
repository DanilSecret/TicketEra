"use client"

import Header from "@/app/components/header";
import Link from "next/link";

export default function Home() {
    const products = [
        "Облачное хранилище CloudX",
        "VPN-сервис SafeRoute",
        "IDE для фронтенда DevBox",
        "Система аналитики DataWatch",
        "Платформа онлайн-обучения LearnIT"
    ];

    return (
        <div className="bg-[#03062c] min-h-screen text-white flex flex-col">
            <Header/>

            {/* Приветственный текст */}
            <section className="p-8 flex justify-center items-center mb-12">
                <div className="max-w-screen-lg mx-auto w-full text-center">
                    <p className="text-2xl  max-w-xl mx-auto">
                        Мы рады видеть вас на нашем сайте! Здесь вы найдете качественную продукцию, созданную с заботой о вас.
                    </p>
                </div>
            </section>

            {/* Карточки товаров */}
            <section className="px-4 py-8 flex justify-center items-center mb-12">
                <div className="max-w-screen-xl mx-auto w-full">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Наша продукция</h2>
                    <p className="mb-4 text-center">Мы предлагаем широкий ассортимент IT-товаров, соответствующих высоким стандартам качества.</p>
                    <div className="overflow-x-auto flex space-x-4 pb-2 justify-center">
                        {products.map((product, index) => (
                            <div key={index} className="min-w-[220px] bg-[#1a1d45] p-4 rounded-xl shadow-md">
                                <h3 className="text-lg font-medium text-center">{product}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Форма с кнопкой */}
            <section className="p-8 flex justify-center items-center mb-12">
                <div className="max-w-screen-lg mx-auto w-full border border-[1px] border-gray-400 p-8 text-center rounded-xl">
                    <h2 className="text-xl font-semibold mb-2">Обратная связь</h2>
                    <p className="mb-4">Если вы нашли проблемы в программе, просто подайте:</p>
                    <Link href="/create_ticket/" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 rounded-xl text-white font-bold transition">
                        Создать заявку
                    </Link>
                </div>
            </section>


            {/* Футер */}
            <footer className="mt-auto bg-[#0a0d3a] py-6 text-center">
                <p className="text-sm text-gray-400">© 2025 IT Solutions. Все права защищены.</p>
            </footer>
        </div>
    )
}
