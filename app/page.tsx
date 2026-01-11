"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GuestInfo {
    name: string;
    status: string | null;
}

const Page = () => {
    const router = useRouter();
    const [guestCode, setGuestCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem("guest_session");
            if (!token) return;

            try {
                const response = await fetch("/api/auth/session", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setGuestInfo(data.guest);
                } else {
                    localStorage.removeItem("guest_session");
                }
            } catch (err) {
                console.error("Session check failed", err);
            }
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!guestCode.trim()) {
            setError("Please enter your guest code");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: guestCode.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "An error occurred");
                setIsLoading(false);
                return;
            }

            // Store token in localStorage
            localStorage.setItem("guest_session", data.token);
            setGuestInfo(data.guest);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenInvitation = () => {
        router.push("/invitation");
    };

    return (
        <main className="relative w-full h-screen overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                aria-label="Wedding video background"
            >
                <source src="/Wedding Video Banner.mp4" type="video/mp4" />
            </video>

            {/* Content Layer */}
            <section className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
                {/* Logo Container */}
                <header className="w-[91px] md:hidden transition-all duration-300">
                    <Image
                        src="/Logo Initial - Colored BG 1.png"
                        alt="J&H Wedding Logo"
                        width={91}
                        height={91}
                        className="w-full h-auto"
                        priority
                    />
                </header>

                {/* White Card Container */}
                <article className="bg-white rounded-[10px] shadow-[0_1px_4px_0_#F9F9F9] px-11 md:px-16 py-8 md:py-14 w-[clamp(304px,90%,530px)] min-h-[221px] md:min-h-[315px] flex flex-col items-center justify-center">
                    {/* Title */}
                    <h1 className="text-center mb-3 font-eb-garamond text-[clamp(1.125rem,3vw,1.75rem)] font-bold text-[#4a4a4a]">
                        {!guestInfo
                            ? `FIND MY INVITATION`
                            : `WELCOME, ${guestInfo.name.toUpperCase()}!`}
                    </h1>

                    {/* Instructional Text */}
                    <p className="text-center mb-8 font-eb-garamond text-[clamp(0.8125rem,3vw,1.125rem)] font-semibold text-[#4a4a4a]">
                        {!guestInfo
                            ? `Kindly enter your Guest code to find your invitation.`
                            : `You have one reserved seat in your name.`}
                    </p>

                    {/* Form */}
                    {!guestInfo && (
                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-xs flex flex-col items-center"
                        >
                            {/* Input Field */}
                            <input
                                type="text"
                                value={guestCode}
                                onChange={(e) => {
                                    setGuestCode(e.target.value);
                                    setError(null);
                                }}
                                placeholder=""
                                className="w-full max-w-[298px] h-[clamp(28px,8vw,35px)] px-4 border border-[#7D7D7D] rounded-[5px] font-eb-garamond text-[clamp(0.75rem,3vw,0.875rem)] text-[#4a4a4a] bg-white outline-none transition-colors duration-200 focus:border-[#9ca3af]"
                                disabled={isLoading || !!guestInfo}
                                aria-label="Guest code input"
                            />

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-xs text-center" role="alert">
                                    {error}
                                </p>
                            )}

                            {/* Button */}
                            <button
                                type="submit"
                                className="h-[clamp(30px,8vw,35px)] px-8 bg-[#7A8850] text-white rounded-[4px] font-eb-garamond text-[clamp(0.75rem,3vw,0.875rem)] font-medium cursor-pointer transition-colors duration-200 hover:bg-[#5a7a5a] active:bg-[#4a6a4a] mt-5"
                                disabled={isLoading}
                            >
                                {isLoading ? "Checking..." : "Let's Go!"}
                            </button>
                        </form>
                    )}

                    {/* Invitation Result Section */}
                    {guestInfo && (
                        <button
                            className="h-[42px] px-6 bg-[#7A8850] text-white rounded-[8px] font-eb-garamond text-[0.9375rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[#333333] hover:-translate-y-px active:bg-black"
                            onClick={handleOpenInvitation}
                        >
                            Open My Invitation
                        </button>
                    )}

                    <p className="font-eb-garamond italic text-center text-xs text-[#1E61AE] mt-7 w-auto md:w-[286px]">
                        Reminder: Your invitation is saved to this device and
                        won't open on other devices.
                    </p>
                </article>
            </section>

            {/* Desktop Bottom Right Logo */}
            <aside className="hidden md:block absolute bottom-10 right-10 z-20 opacity-90 hover:opacity-100 transition-opacity duration-300">
                <Image
                    src="/JH WEDDING LOGO - WHITE.png"
                    alt="J&H Wedding Logo"
                    width={310}
                    height={310}
                    className="w-[310px] h-auto"
                    priority
                />
            </aside>
        </main>
    );
};

export default Page;
