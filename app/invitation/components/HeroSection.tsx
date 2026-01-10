"use client";

import React from "react";
import Image from "next/image";

const HeroSection = () => {
    return (
        <div className="relative z-10 w-full h-[calc(100vh-200px)] md:h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0 video-bg-mobile video-opacity-gradient"
            >
                <source src="/Wedding Video Banner.mp4" type="video/mp4" />
            </video>

            <div className="relative z-10 flex flex-col items-center drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
                <div className="mb-8">
                    <Image
                        src="/Logo Initial - Colored BG (1) 1.png"
                        alt="J&H Wedding Logo"
                        width={255}
                        height={255}
                        className="w-[clamp(108px,25vw,255px)] h-auto"
                        priority
                    />
                </div>
                <div className="font-oswald text-white text-[clamp(11px,2.5vw,30px)] tracking-[0.5em] font-light mb-5">
                    THE WEDDING OF
                </div>
                <div className="font-italianno text-white text-[clamp(55px,15vw,200px)] tracking-widest leading-none mb-8 md:mb-20">
                    Jofer{" "}
                    <span className="text-white text-[clamp(25px,8vw,100px)]">
                        &
                    </span>{" "}
                    Hope
                </div>
                <div className="text-white text-[10px] md:text-[28px] font-oswald tracking-[0.2em] font-light">
                    03.07.2026 | SAN PEDRO CITY, LAGUNA
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
