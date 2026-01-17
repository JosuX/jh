"use client";

import React, { useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";

interface GuestInfo {
    name: string;
    code: string;
}

type RSVPState = "loading" | "form" | "confirmed";

const RSVP = () => {
    const [guestCode, setGuestCode] = React.useState("");
    const [state, setState] = React.useState<RSVPState>("loading");
    const [guestInfo, setGuestInfo] = React.useState<GuestInfo | null>(null);
    const [error, setError] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Generate QR code on canvas
    const generateQRCode = useCallback(async (code: string) => {
        if (canvasRef.current) {
            try {
                await QRCode.toCanvas(canvasRef.current, code, {
                    width: 250,
                    margin: 2,
                    color: {
                        dark: "#2F2F2F",
                        light: "#FFFFFF",
                    },
                });
            } catch (err) {
                console.error("Error generating QR code:", err);
            }
        }
    }, []);

    // Check localStorage for existing RSVP on mount
    useEffect(() => {
        const checkExistingRSVP = async () => {
            const storedCode = localStorage.getItem("guestCode");
            
            if (!storedCode) {
                setState("form");
                return;
            }

            try {
                const response = await fetch(`/api/rsvp?code=${encodeURIComponent(storedCode)}`);
                const data = await response.json();

                if (data.success && data.rsvpConfirmed) {
                    setGuestInfo(data.guest);
                    setState("confirmed");
                } else {
                    // Code in localStorage is invalid or not confirmed, clear it
                    localStorage.removeItem("guestCode");
                    setState("form");
                }
            } catch (err) {
                console.error("Error checking RSVP status:", err);
                setState("form");
            }
        };

        checkExistingRSVP();
    }, []);

    // Generate QR code when confirmed
    useEffect(() => {
        if (state === "confirmed" && guestInfo) {
            generateQRCode(guestInfo.code);
        }
    }, [state, guestInfo, generateQRCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!guestCode.trim()) {
            setError("Please enter your guest code");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/rsvp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: guestCode.trim() }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("guestCode", data.guest.code);
                setGuestInfo(data.guest);
                setState("confirmed");
            } else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error("Error confirming RSVP:", err);
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadQR = () => {
        if (canvasRef.current && guestInfo) {
            const link = document.createElement("a");
            link.download = `wedding-qr-${guestInfo.code}.png`;
            link.href = canvasRef.current.toDataURL("image/png");
            link.click();
        }
    };

    return (
        <div
            className="w-full min-h-[clamp(500px,80vh,800px)] bg-cover bg-center justify-center items-center flex flex-col text-white px-6 md:px-10 py-20 text-center font-oswald"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/RSVP IMAGE 1.png')",
            }}
        >
            <div className="text-[clamp(45px,10vw,90px)] font-italianno font-bold tracking-wider mb-6">
                RSVP
            </div>

            {state === "loading" && (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <p className="text-[clamp(14px,2.5vw,24px)] font-light tracking-wide">
                        Loading...
                    </p>
                </div>
            )}

            {state === "form" && (
                <>
                    <div className="max-w-3xl text-[clamp(14px,2.5vw,24px)] font-light tracking-wide leading-relaxed space-y-6">
                        <p>
                            To confirm your attendance, please enter the unique{" "}
                            <span className="font-bold">GUEST CODE</span> provided
                            on your invitation. This code helps us ensure a smooth
                            and organized confirmation process for everyone.
                        </p>

                        <p>
                            Kindly respond on or before <br />
                            <span className="font-bold text-[clamp(18px,3vw,32px)]">
                                February 7, 2026
                            </span>
                        </p>

                        <p>
                            Once your attendance is confirmed, all that&apos;s left
                            to do is count the days, we can&apos;t wait to see you
                            there!
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-4 w-full max-w-md md:max-w-lg justify-center items-center">
                        <input
                            type="text"
                            value={guestCode}
                            onChange={(e) => {
                                setGuestCode(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter the Code Here"
                            className="w-[clamp(260px,80%,400px)] bg-transparent border border-white text-white placeholder:text-white/70 mb-2 rounded-sm text-center font-light font-oswald tracking-[0.2em] focus:outline-none px-7 py-3 transition-all text-base md:text-lg uppercase"
                            disabled={isSubmitting}
                        />
                        {error && (
                            <p className="text-red-300 text-sm -mt-2">{error}</p>
                        )}
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-[clamp(260px,80%,400px)] bg-[#7A8850] text-white border border-white hover:bg-[#6b7746] font-oswald font-medium tracking-[0.2em] px-7 py-3 rounded-sm transition-all uppercase cursor-pointer whitespace-nowrap text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Confirming..." : "Confirm Attendance!"}
                        </button>
                    </form>
                </>
            )}

            {state === "confirmed" && guestInfo && (
                <div className="flex flex-col items-center gap-6">
                    <div className="max-w-3xl text-[clamp(14px,2.5vw,24px)] font-light tracking-wide leading-relaxed space-y-4">
                        <p className="text-[clamp(18px,3vw,32px)] font-bold">
                            Thank you, {guestInfo.name}!
                        </p>
                        <p>
                            Your attendance has been confirmed. Please save or download
                            your QR code below and present it at the venue for check-in.
                        </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <canvas ref={canvasRef} />
                    </div>
                    
                    <p className="text-sm opacity-80">
                        Guest Code: <span className="font-bold">{guestInfo.code}</span>
                    </p>

                    <button
                        onClick={handleDownloadQR}
                        className="bg-[#7A8850] text-white border border-white hover:bg-[#6b7746] font-oswald font-medium tracking-[0.2em] px-7 py-3 rounded-sm transition-all uppercase cursor-pointer whitespace-nowrap text-base md:text-lg"
                    >
                        Download QR Code
                    </button>
                </div>
            )}
        </div>
    );
};

export default RSVP;
