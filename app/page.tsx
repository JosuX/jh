"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GuestInfo {
    name: string;
    status: string | null;
}

const isMessengerBrowser = () => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || navigator.vendor || "";
    // Detect Facebook/Messenger in-app browser
    return /FBAN|FBAV|Messenger|FB_IAB|FBIOS|FBSS/i.test(ua);
};

const Page = () => {
    const router = useRouter();
    const [guestCode, setGuestCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
    const [showMessengerBlock, setShowMessengerBlock] = useState(false);

    // Check for Messenger browser on mount
    useEffect(() => {
        if (isMessengerBrowser()) {
            setShowMessengerBlock(true);
        }
    }, []);

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

    // Get current URL for copy functionality
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            alert("Link copied! Paste it in your browser.");
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = currentUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            alert("Link copied! Paste it in your browser.");
        }
    };

    return (
        <main className="relative w-full h-screen overflow-hidden">
            {/* Messenger Browser Block Modal */}
            {showMessengerBlock && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[15px] shadow-2xl p-8 w-full max-w-[380px] text-center">
                        {/* Warning Icon */}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                            <svg 
                                className="w-8 h-8 text-orange-500" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                />
                            </svg>
                        </div>

                        <h2 className="font-eb-garamond text-xl font-bold text-[#4a4a4a] mb-2">
                            Open in Browser
                        </h2>

                        <p className="font-eb-garamond text-sm text-[#666] mb-6 leading-relaxed">
                            This invitation works best in your phone&apos;s default browser. 
                            Please open this link in <strong>Safari</strong> or <strong>Chrome</strong> for the full experience.
                        </p>

                        {/* Instructions */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <p className="font-eb-garamond text-xs font-semibold text-[#4a4a4a] mb-3 uppercase tracking-wider">
                                How to open:
                            </p>
                            <ol className="font-eb-garamond text-sm text-[#666] space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="shrink-0 w-5 h-5 bg-[#7A8850] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                                    <span>Tap the <strong>⋮</strong> or <strong>⋯</strong> menu icon</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="shrink-0 w-5 h-5 bg-[#7A8850] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                                    <span>Select <strong>&quot;Open in Browser&quot;</strong> or <strong>&quot;Open in Safari/Chrome&quot;</strong></span>
                                </li>
                            </ol>
                        </div>

                        {/* Copy Link Button */}
                        <button
                            onClick={handleCopyLink}
                            className="w-full py-3 bg-[#7A8850] text-white rounded-lg font-eb-garamond font-bold text-sm uppercase tracking-wider hover:bg-[#6b7746] transition-colors mb-3"
                        >
                            Copy Link
                        </button>

                        <p className="font-eb-garamond text-xs text-gray-400 italic">
                            Or copy this link and paste in your browser
                        </p>
                    </div>
                </div>
            )}

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
                <header className="w-[100px] md:hidden transition-all duration-300 mb-8">
                    <Image
                        src="/JH WEDDING LOGO - WHITE.png"
                        alt="J&H Wedding Logo"
                        width={100}
                        height={100}
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
                                    // Only allow uppercase alphanumeric characters
                                    const sanitized = e.target.value
                                        .toUpperCase()
                                        .replace(/[^A-Z0-9]/g, '');
                                    setGuestCode(sanitized);
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
                        won&apos;t open on other devices.
                    </p>
                </article>
            </section>

            {/* Desktop Bottom Right Logo */}
            <aside className="hidden md:block absolute bottom-10 right-10 z-20 opacity-90 hover:opacity-100 transition-opacity duration-300">
                <Image
                    src="/JH WEDDING LOGO - WHITE.png"
                    alt="J&H Wedding Logo"
                    width={180}
                    height={180}
                    className="w-[180px] h-auto"
                    priority
                />
            </aside>
        </main>
    );
};

export default Page;
